import { UserModel } from '@luna/api/model/types';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { useInitRef } from '@luna/hooks/useInitRef';
import { mapAsyncIterable, mergeAsyncIterables } from '@luna/utils/async';
import { getOrThrow } from '@luna/utils/result';
import { Lock } from '@luna/utils/semaphore';
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
}

export const ModelContext = createContext<ModelContextValue>({
  users: {
    models: Map(),
    active: Set(),
  },
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

  const clientLock = useInitRef<Lock>(() => new Lock());
  const [client, setClient] = useState<Lighthouse>();

  const username = auth.user?.username;
  const tokenValue = auth.token?.value;

  // TODO: Expose more general CRUD methods of the nighthouse API

  useEffect(() => {
    (async () => {
      return await clientLock.current.use(async () => {
        if (client !== undefined) {
          await client.close();
        }

        if (!username || !tokenValue) {
          setLoggedIn(false);
          return;
        }

        console.log(`Connecting as ${username}`);
        const newClient = connect({
          url:
            process.env.REACT_APP_MODEL_SERVER_URL ??
            'wss://lighthouse.uni-kiel.de/websocket',
          auth: { USER: username, TOKEN: tokenValue },
          logHandler: new LeveledLogHandler(
            LogLevel.Debug,
            new ConsoleLogHandler('Nighthouse: ')
          ),
        });
        setClient(newClient);
        await newClient.ready();

        setLoggedIn(true);
      });
    })();
  }, [username, tokenValue, client, clientLock]);

  const getUserStreams = useCallback(
    async function* () {
      if (!isLoggedIn || !client) return;
      try {
        const users = getOrThrow(await auth.getPublicUsers());
        // Make sure that every user has at least a black frame
        for (const { username } of users) {
          yield { username, frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES) };
        }
        const streams = await Promise.all(
          users.map(async ({ username }) => {
            const stream = await clientLock.current.use(
              async () => await client.streamModel(username)
            );
            return mapAsyncIterable(stream, model => ({
              username,
              // FIXME: This will not handle events correctly, we should filter properly
              frame:
                model.PAYL instanceof Uint8Array
                  ? model.PAYL
                  : new Uint8Array(LIGHTHOUSE_FRAME_BYTES),
            }));
          })
        );
        yield* mergeAsyncIterables(streams);
      } catch (error) {
        console.error(`Could not get user streams: ${error}`);
      }
    },
    [isLoggedIn, client, auth, clientLock]
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

  return (
    <ModelContext.Provider value={{ users }}>{children}</ModelContext.Provider>
  );
}
