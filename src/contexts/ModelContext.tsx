import { ModelBackend } from '@luna/backends/model/ModelBackend';
import { AuthContext } from '@luna/contexts/AuthContext';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { useInitRef } from '@luna/hooks/useInitRef';
import { mergeAsyncIterables } from '@luna/utils/async';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LighthouseModelBackend } from '@luna/backends/model/LighthouseModelBackend';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { Map, Set } from 'immutable';

export interface Users {
  /** The most recent frames by username. */
  readonly frames: Map<string, Uint8Array>;

  /** The usernames of active users. */
  readonly active: Set<string>;
}

export interface Model {
  /** The user models, active users etc. */
  readonly users: Users;
}

export const ModelContext = createContext<Model>({
  users: {
    frames: Map(),
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
    frames: Map(),
    active: Set(),
  });

  const backendRef = useInitRef<ModelBackend>(
    () => new LighthouseModelBackend(process.env.REACT_APP_MODEL_SERVER_URL)
  );

  useEffect(() => {
    (async () => {
      if (auth.user && auth.token) {
        await backendRef.current.logIn(auth.user.username, auth.token.value);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    })();
  }, [auth.user, auth.token, backendRef]);

  const getUserStreams = useCallback(
    async function* () {
      if (!isLoggedIn) return;
      const users = await auth.getPublicUsers();
      // Make sure that every user has at least a black frame
      for (const { username } of users) {
        yield { username, frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES) };
      }
      const streams = users.map(async function* ({ username }) {
        for await (const payload of await backendRef.current.stream([
          'user',
          username,
          'model',
        ])) {
          if (payload instanceof Uint8Array) {
            yield { username, frame: payload };
          }
        }
      });
      yield* mergeAsyncIterables(streams);
    },
    [isLoggedIn, auth, backendRef]
  );

  // NOTE: It is important that we use `useCallback` for the consumption callback
  // since otherwise every rerender will create a new function, triggering a change
  // is the `useEffect` that `useAsyncIterable` uses internally, which reregisters
  // a new iterator on every render. This seems to cause some kind of cyclic dependency
  // that freezes the application.

  const consumeUserStreams = useCallback(
    async ({ username, frame }: { username: string; frame: Uint8Array }) => {
      setUsers(({ frames, active }) => ({
        frames: frames.set(username, frame),
        active: frames.has(username) ? active.add(username) : active,
      }));
    },
    []
  );

  useAsyncIterable(getUserStreams, consumeUserStreams);

  return (
    <ModelContext.Provider value={{ users }}>{children}</ModelContext.Provider>
  );
}
