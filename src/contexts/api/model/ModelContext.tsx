import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { UserModel } from '@luna/contexts/api/model/types';
import { errorResult, getOrThrow, okResult, Result } from '@luna/utils/result';
import { Set } from 'immutable';
import {
  connect,
  ConsoleLogHandler,
  DirectoryTree,
  InputEvent,
  LegacyInputEvent,
  LeveledLogHandler,
  Lighthouse,
  LogLevel,
  ServerMessage,
} from 'nighthouse/browser';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface Users {
  /** The usernames of all users. */
  readonly all: Set<string>;

  /** The usernames of active users. */
  readonly active: Set<string>;
}

export interface ModelAPI {
  /** Lists an arbitrary path. */
  list(path: string[]): Promise<Result<DirectoryTree>>;

  /** Fetches an arbitrary path. */
  get(path: string[]): Promise<Result<unknown>>;

  /** Streams the resource at an arbitrary path. */
  stream(path: string[]): AsyncIterable<unknown>;

  /** Streams the model of the given user. */
  streamModel(user: string): AsyncIterable<UserModel>;

  /** Deletes a resource at an arbitrary path. */
  delete(path: string[]): Promise<Result<unknown>>;

  /** Creates a resource at an arbitrary path. */
  create(path: string[]): Promise<Result<unknown>>;

  /** Updates a resource at an arbitrary path. */
  put(path: string[], payload: any): Promise<Result<unknown>>;

  /** Sends a legacy input event for the given user to the given endpoint. */
  putLegacyInput(
    user: string,
    payload: LegacyInputEvent
  ): Promise<Result<unknown>>;

  /** Sends an input event for the given user to the given endpoint. */
  putInput(user: string, payload: InputEvent): Promise<Result<unknown>>;

  /** Creates a directory at an arbitrary path. */
  mkdir(path: string[]): Promise<Result<unknown>>;

  /** Tests whether a path is a directory. */
  isDirectory(path: string[]): Promise<boolean>;

  /** Moves a resource to an arbitrary path. */
  move(path: string[], newPath: string[]): Promise<Result<void>>;
}

export interface ModelContextValue {
  /** The user models, active users etc. */
  readonly users: Users;

  /** A facility interact with the model server API. */
  readonly api: ModelAPI;
}

export const ModelContext = createContext<ModelContextValue>({
  users: {
    all: Set(),
    active: Set(),
  },
  api: {
    list: async () => errorResult('No model context for listing path'),
    get: async () => errorResult('No model context for fetching path'),
    async *stream() {},
    async *streamModel() {},
    delete: async () => errorResult('No model context for deleting path'),
    put: async () => errorResult('No model context for updating resource'),
    putLegacyInput: async () =>
      errorResult('No model context for putting input'),
    putInput: async () => errorResult('No model context for putting input'),
    create: async () => errorResult('No model context for creating resource'),
    mkdir: async () => errorResult('No model context for creating directory'),
    isDirectory: async () => false,
    move: async () => errorResult('No model context for moving resource'),
  },
});

interface ModelContextProviderProps {
  children: ReactNode;
}

function messageToResult<T>(message: ServerMessage<T> | undefined): Result<T> {
  try {
    if (!message) {
      return errorResult('Model server provided no results');
    }
    if (message.RNUM >= 400) {
      return errorResult(
        `Model server errored: ${message.RNUM} ${message.RESPONSE ?? ''}`
      );
    }
    return okResult(message.PAYL);
  } catch (error) {
    return errorResult(error);
  }
}

export function ModelContextProvider({ children }: ModelContextProviderProps) {
  const auth = useContext(AuthContext);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState<Users>({
    all: Set(),
    active: Set(),
  });

  const [client, setClient] = useState<Lighthouse>();

  const username = useMemo(() => auth.user?.username, [auth.user]);
  const tokenValue = useMemo(() => auth.token?.value, [auth.token]);

  // TODO: Expose more general CRUD methods of the nighthouse API

  useEffect(() => {
    let client: Lighthouse | undefined = undefined;
    (async () => {
      if (!username || !tokenValue) {
        setLoggedIn(false);
        return;
      }

      console.log(`Connecting as ${username}`);
      client = connect({
        url:
          process.env.REACT_APP_MODEL_SERVER_URL ??
          'wss://lighthouse.uni-kiel.de/websocket',
        auth: { USER: username, TOKEN: tokenValue },
        logHandler: new LeveledLogHandler(
          LogLevel.Debug,
          new ConsoleLogHandler('Nighthouse: ')
        ),
      });
      await client.ready();

      setClient(client);
      setLoggedIn(true);
    })();
    return () => {
      (async () => {
        await client?.close();
      })();
    };
  }, [username, tokenValue]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    (async () => {
      try {
        const users = getOrThrow(await auth.getAllUsers());
        const all = Set(users.map(user => user.username));
        setUsers(({ active }) => ({ all, active }));
      } catch (error) {
        console.error(`Could not get users: ${error}`);
      }
    })();
  }, [auth, isLoggedIn]);

  const api: ModelAPI = useMemo(
    () => ({
      async list(path) {
        return messageToResult(await client?.list(path));
      },
      async get(path) {
        return messageToResult(await client?.get(path));
      },
      async *stream(path) {
        if (client) {
          for await (const message of client.stream(path)) {
            const result = messageToResult(message);
            if (result.ok) {
              yield result.value;
            } else {
              console.error(
                `Got error in stream of ${JSON.stringify(path)}: ${result.error}`
              );
            }
          }
        }
      },
      async *streamModel(user) {
        for await (const value of this.stream(['user', user, 'model'])) {
          if (typeof value === 'object' && value instanceof Uint8Array) {
            yield {
              frame: value,
            };
          }
        }
      },
      async delete(path) {
        return messageToResult(await client?.delete(path));
      },
      async put(path, payload) {
        return messageToResult(await client?.put(path, payload));
      },
      async putLegacyInput(user, payload) {
        return messageToResult(await client?.putModel(payload, user));
      },
      async putInput(user, payload) {
        return messageToResult(await client?.putInput(payload, user));
      },
      async create(path) {
        return messageToResult(await client?.create(path));
      },
      async mkdir(path) {
        return messageToResult(await client?.mkdir(path));
      },
      async isDirectory(path) {
        try {
          getOrThrow(messageToResult(await client?.list(path)));
          return true;
        } catch {
          return false;
        }
      },
      async move(path, newPath) {
        // TODO: Implement native move in beacon?
        try {
          if (JSON.stringify(path) === JSON.stringify(newPath)) {
            return okResult(undefined);
          }
          if (await this.isDirectory(path)) {
            return errorResult('Cannot move directories (yet)');
          }
          const value = getOrThrow(messageToResult(await client?.get(path)));
          getOrThrow(messageToResult(await client?.post(newPath, value)));
          getOrThrow(messageToResult(await client?.delete(path)));
          return okResult(undefined);
        } catch (error) {
          return errorResult(error);
        }
      },
    }),
    [client]
  );

  const value: ModelContextValue = useMemo(
    () => ({
      users,
      api,
    }),
    [users, api]
  );

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
}
