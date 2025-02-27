import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { LaserMetrics, UserModel } from '@luna/contexts/api/model/types';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { mergeAsyncIterables } from '@luna/utils/async';
import { errorResult, getOrThrow, okResult, Result } from '@luna/utils/result';
import { Map, Set } from 'immutable';
import {
  connect,
  ConsoleLogHandler,
  LeveledLogHandler,
  Lighthouse,
  LIGHTHOUSE_FRAME_BYTES,
  LogLevel,
} from 'nighthouse/browser';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface Users {
  /** The user models by username. */
  readonly models: Map<string, UserModel>;

  /** The usernames of active users. */
  readonly active: Set<string>;
}

export interface ModelContextValue {
  /** The user models, active users etc. */
  readonly users: Users;

  /** Fetches an arbitrary path. */
  get(path: string[]): Promise<Result<unknown>>;

  /** Fetches lamp server metrics. */
  getLaserMetrics(): Promise<Result<LaserMetrics>>;
}

export const ModelContext = createContext<ModelContextValue>({
  users: {
    models: Map(),
    active: Set(),
  },
  get: async () => errorResult('No model context for fetching path'),
  getLaserMetrics: async () =>
    errorResult('No model context for fetching laser metrics'),
});

interface ModelContextProviderProps {
  children: ReactNode;
}

export function ModelContextProvider({ children }: ModelContextProviderProps) {
  const auth = useContext(AuthContext);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState<Users>({
    models: Map(),
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

  const getUserStreams = useCallback(
    async function* () {
      if (!isLoggedIn || !client) return;
      try {
        const users = getOrThrow(await auth.getAllUsers());
        // Make sure that every user has at least a black frame
        for (const { username } of users) {
          yield { username, frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES) };
        }
        const streams = await Promise.all(
          users.map(async ({ username }) => {
            const stream = await client.streamModel(username);
            return (async function* () {
              for await (const model of stream) {
                if (model.PAYL instanceof Uint8Array) {
                  yield { username, frame: model.PAYL };
                }
              }
            })();
          })
        );
        yield* mergeAsyncIterables(streams);
      } catch (error) {
        console.error(`Could not get user streams: ${error}`);
      }
    },
    [isLoggedIn, client, auth]
  );

  // NOTE: It is important that we use `useCallback` for the consumption callback
  // since otherwise every rerender will create a new function, triggering a change
  // is the `useEffect` that `useAsyncIterable` uses internally, which reregisters
  // a new iterator on every render. This seems to cause some kind of cyclic dependency
  // that freezes the application.

  const consumeUserStreams = useCallback(
    async ({ username, ...userModel }: { username: string } & UserModel) => {
      setUsers(({ models, active }) => ({
        models: models.set(username, userModel),
        active: models.has(username) ? active.add(username) : active,
      }));
    },
    []
  );

  useAsyncIterable(getUserStreams, consumeUserStreams);

  const value: ModelContextValue = useMemo(
    () => ({
      users,
      async get(path) {
        try {
          const message = await client?.get(path);
          if (!message) {
            return errorResult('Model server provided no results');
          }
          if (message.RNUM >= 400) {
            return errorResult(
              `Model server errored while fetching ${JSON.stringify(path)}: ${message.RNUM} ${message.RESPONSE ?? ''}`
            );
          }
          return okResult(message.PAYL);
        } catch (error) {
          return errorResult(error);
        }
      },
      async getLaserMetrics() {
        return (await this.get(['metrics', 'laser'])) as Result<LaserMetrics>;
      },
    }),
    [client, users]
  );

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
}
