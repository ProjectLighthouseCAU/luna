import { ModelApi } from '@luna/api/model/ModelApi';
import { AuthContext } from '@luna/contexts/AuthContext';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { useInitRef } from '@luna/hooks/useInitRef';
import { UserModel } from '@luna/api/model/types/UserModel';
import { mapAsyncIterable, mergeAsyncIterables } from '@luna/utils/async';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LighthouseModelApi } from '@luna/api/model/LighthouseModelApi';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { Map, Set } from 'immutable';

export interface Users {
  /** The user models by username. */
  readonly models: Map<string, UserModel>;

  /** The usernames of active users. */
  readonly active: Set<string>;
}

export interface Model {
  /** The user models, active users etc. */
  readonly users: Users;
}

export const ModelContext = createContext<Model>({
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

  const apiRef = useInitRef<ModelApi>(
    () => new LighthouseModelApi(process.env.REACT_APP_MODEL_SERVER_URL)
  );

  const username = auth.user?.username;
  const tokenValue = auth.token?.value;

  useEffect(() => {
    (async () => {
      if (username && tokenValue) {
        console.log(`Logging in as ${username}`);
        await apiRef.current.logIn(username, tokenValue);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    })();
  }, [username, tokenValue, apiRef]);

  const getUserStreams = useCallback(
    async function* () {
      if (!isLoggedIn) return;
      const users = await auth.getPublicUsers();
      // Make sure that every user has at least a black frame
      for (const { username } of users) {
        yield { username, frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES) };
      }
      const streams = users.map(({ username }) =>
        mapAsyncIterable(apiRef.current.streamModel(username), userModel => ({
          username,
          ...userModel,
        }))
      );
      yield* mergeAsyncIterables(streams);
    },
    [isLoggedIn, auth, apiRef]
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
