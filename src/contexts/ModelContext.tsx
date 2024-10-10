import { LighthouseModelApi } from '@luna/api/model/lighthouse';
import { ModelApi } from '@luna/api/model/ModelApi';
import { UserModel } from '@luna/api/model/types';
import { AuthContext } from '@luna/contexts/AuthContext';
import { useInitRef } from '@luna/hooks/useInitRef';
import { getOrThrow } from '@luna/utils/result';
import { Set } from 'immutable';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import {
  ReactNode,
  createContext,
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

export interface ModelContextValue {
  /** Known/active users. */
  readonly users: Users;

  /** Streams a model. */
  streamModel(user: string): Promise<AsyncIterable<UserModel>>;
}

export const ModelContext = createContext<ModelContextValue>({
  users: {
    all: Set(),
    active: Set(),
  },
  async streamModel() {
    return (async function* () {
      yield { frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES) };
    })();
  },
});

interface ModelContextProviderProps {
  children: ReactNode;
}

export function ModelContextProvider({ children }: ModelContextProviderProps) {
  const auth = useContext(AuthContext);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState<Users>({
    all: Set(),
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

  useEffect(() => {
    (async () => {
      if (!isLoggedIn) return;
      try {
        const users = getOrThrow(await auth.getAllUsers());
        const all = Set(users.map(user => user.username));
        setUsers(({ active }) => ({ all, active }));
      } catch (error) {
        console.error(`Could not get users: ${error}`);
      }
    })();
  }, [isLoggedIn, auth]);

  const value: ModelContextValue = useMemo(
    () => ({
      users,
      async streamModel(user) {
        if (!users.active.has(user)) {
          setUsers(({ all, active }) => ({ all, active: active.add(user) }));
        }
        return await apiRef.current.streamModel(user);
      },
    }),
    [apiRef, users]
  );

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
}
