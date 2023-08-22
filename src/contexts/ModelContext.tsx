import { ModelClient } from '@luna/client/model/ModelClient';
import { NullModelClient } from '@luna/client/model/NullModelClient';
import { AuthContext } from '@luna/contexts/AuthContext';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { useInitRef } from '@luna/hooks/useInitRef';
import { UserModel } from '@luna/client/model/UserModel';
import { mapAsyncIterable, mergeAsyncIterables } from '@luna/utils/async';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { NighthouseModelClient } from '@luna/client/model/NighthouseModelClient';

export interface Model {
  /** The user models by username. */
  readonly userModels: Map<string, UserModel>;

  /** The client used to perform requests. */
  readonly client: ModelClient;
}

export const ModelContext = createContext<Model>({
  userModels: new Map(),
  client: new NullModelClient(),
});

interface ModelContextProviderProps {
  children: ReactNode;
}

export function ModelContextProvider({ children }: ModelContextProviderProps) {
  const auth = useContext(AuthContext);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userModels, setUserModels] = useState(new Map<string, UserModel>());
  const clientRef = useInitRef<ModelClient>(() => new NighthouseModelClient());

  useEffect(() => {
    (async () => {
      if (auth.username !== null) {
        const token = await auth.client.getToken();
        if (token) {
          await clientRef.current.logIn(auth.username, token.token);
          setLoggedIn(true);
          return;
        }
      }
      setLoggedIn(false);
    })();
  }, [auth.client, auth.username, clientRef]);

  const getUserStreams = useCallback(
    async function* () {
      if (!isLoggedIn) return;
      const users = await auth.client.getPublicUsers();
      const streams = users.map(user =>
        mapAsyncIterable(clientRef.current.streamModel(user), userModel => ({
          user,
          ...userModel,
        }))
      );
      yield* mergeAsyncIterables(streams);
    },
    [isLoggedIn, auth.client, clientRef]
  );

  // NOTE: It is important that we use `useCallback` for the consumption callback
  // since otherwise every rerender will create a new function, triggering a change
  // is the `useEffect` that `useAsyncIterable` uses internally, which reregisters
  // a new iterator on every render. This seems to cause some kind of cyclic dependency
  // that freezes the application.

  const consumeUserStreams = useCallback(
    async ({ user, ...userModel }: { user: string } & UserModel) => {
      console.log(`Got frame from ${user}`);
      setUserModels(userModels => {
        const newUserModels = new Map(userModels);
        newUserModels.set(user, userModel);
        return newUserModels;
      });
    },
    []
  );

  useAsyncIterable(getUserStreams, consumeUserStreams);

  return (
    <ModelContext.Provider value={{ userModels, client: clientRef.current }}>
      {children}
    </ModelContext.Provider>
  );
}
