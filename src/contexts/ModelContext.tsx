import { ModelService } from '@luna/services/model/ModelService';
import { NullModelService } from '@luna/services/model/NullModelService';
import { AuthContext } from '@luna/contexts/AuthContext';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { useInitRef } from '@luna/hooks/useInitRef';
import { UserModel } from '@luna/services/model/UserModel';
import { mapAsyncIterable, mergeAsyncIterables } from '@luna/utils/async';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { StandardModelService } from '@luna/services/model/StandardModelService';
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

  /** The service to perform requests. */
  readonly service: ModelService;
}

export const ModelContext = createContext<Model>({
  users: {
    models: Map(),
    active: Set(),
  },
  service: new NullModelService(),
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

  const serviceRef = useInitRef<ModelService>(
    () => new StandardModelService(process.env.REACT_APP_MODEL_SERVER_URL)
  );

  useEffect(() => {
    (async () => {
      if (auth.user && auth.token) {
        await serviceRef.current.logIn(auth.user.username, auth.token.value);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    })();
  }, [auth.service, auth.user, auth.token, serviceRef]);

  const getUserStreams = useCallback(
    async function* () {
      if (!isLoggedIn) return;
      const users = await auth.service.getPublicUsers();
      // Make sure that every user has at least a black frame
      for (const { username } of users) {
        yield { username, frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES) };
      }
      const streams = users.map(({ username }) =>
        mapAsyncIterable(
          serviceRef.current.streamModel(username),
          userModel => ({
            username,
            ...userModel,
          })
        )
      );
      yield* mergeAsyncIterables(streams);
    },
    [isLoggedIn, auth.service, serviceRef]
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
    <ModelContext.Provider value={{ users, service: serviceRef.current }}>
      {children}
    </ModelContext.Provider>
  );
}
