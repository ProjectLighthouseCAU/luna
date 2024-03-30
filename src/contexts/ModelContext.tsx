import { LighthouseModelBackend } from '@luna/backends/model/LighthouseModelBackend';
import { ModelBackend } from '@luna/backends/model/ModelBackend';
import { AuthContext } from '@luna/contexts/AuthContext';
import { useInitRef } from '@luna/hooks/useInitRef';
import { Set } from 'immutable';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface Users {
  /** All public users. */
  readonly public: Set<string>;

  /** The usernames of active users. */
  readonly active: Set<string>;
}

export interface Model {
  /** The user models, active users etc. */
  readonly users: Users;

  /** Streams the given resource. */
  stream(path: string[]): AsyncIterable<unknown>;
}

export const ModelContext = createContext<Model>({
  users: {
    public: Set(),
    active: Set(),
  },
  async *stream() {},
});

interface ModelContextProviderProps {
  children: ReactNode;
}

export function ModelContextProvider({ children }: ModelContextProviderProps) {
  const auth = useContext(AuthContext);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState<Users>({
    public: Set(),
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

  useEffect(() => {
    (async () => {
      if (!isLoggedIn) return;
      const users = await auth.getPublicUsers();
      setUsers({
        public: Set(users.map(user => user.username)),
        active: Set(),
      });
    })();
  }, [isLoggedIn, auth]);

  const value: Model = useMemo(
    () => ({
      users,
      async *stream(path) {
        for await (const value of backendRef.current.stream(path)) {
          yield value;
        }
      },
    }),
    [users, backendRef]
  );

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
}
