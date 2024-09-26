import { AuthApi } from '@luna/api/auth/AuthApi';
import { LegacyAuthApi } from '@luna/api/auth/LegacyAuthApi';
import { LighthouseAuthApi } from '@luna/api/auth/LighthouseAuthApi';
import { MockAuthApi } from '@luna/api/auth/MockAuthApi';
import { NullAuthApi } from '@luna/api/auth/NullAuthApi';
import { Token } from '@luna/api/auth/types/Token';
import { User } from '@luna/api/auth/types/User';
import { useInitRef } from '@luna/hooks/useInitRef';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface Auth {
  /** Whether the authentication has finished initializing. */
  readonly isInitialized: boolean;

  /** The authenticated user. */
  readonly user: User | null;

  /** The current token. */
  readonly token: Token | null;

  /** Sign up a new account using a registration key. */
  signUp(
    registrationKey: string,
    username?: string,
    password?: string
  ): Promise<User | null>;

  /** Authenticates with the given credentials. Returns the user on success. */
  logIn(username?: string, password?: string): Promise<User | null>;

  /** Deauthenticates. Returns whether this succeeded. */
  logOut(): Promise<boolean>;

  /** Fetches all users. */
  getAllUsers(): Promise<User[]>;

  /** Fetches the public users. */
  getPublicUsers(): Promise<User[]>;
}

export const AuthContext = createContext<Auth>({
  isInitialized: false,
  user: null,
  token: null,
  signUp: async () => null,
  logIn: async () => null,
  logOut: async () => true,
  getAllUsers: async () => [],
  getPublicUsers: async () => [],
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isInitialized, setInitialized] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<Token | null>(null);

  const apiRef = useInitRef<AuthApi>(() => {
    const authType = process.env.REACT_APP_AUTH_TYPE;
    switch (authType) {
      case 'legacy':
        return new LegacyAuthApi(process.env.REACT_APP_AUTH_SERVER_URL);
      case 'lighthouse':
        return new LighthouseAuthApi(process.env.REACT_APP_AUTH_SERVER_URL);
      case 'mock':
        return new MockAuthApi();
      case 'null':
        return new NullAuthApi();
      default:
        throw new Error(
          `Could not instantiate unknown auth type '${authType}'`
        );
    }
  });

  // TODO: Deal with case-sensitivity, what if the user logs in with a different casing?

  const value: Auth = useMemo(
    () => ({
      isInitialized,
      user,
      token,
      async signUp(registrationKey, username, password) {
        const user = await apiRef.current.signUp(
          registrationKey,
          username,
          password
        );
        if (user !== null) {
          setUser(user);
          setToken(await apiRef.current.getToken());
        }
        return user;
      },

      async logIn(username, password) {
        const user = await apiRef.current.logIn(username, password);
        if (user !== null) {
          setUser(user);
          setToken(await apiRef.current.getToken());
        }
        return user;
      },

      async logOut() {
        if (await apiRef.current.logOut()) {
          setUser(null);
          return true;
        }
        return false;
      },

      async getAllUsers() {
        return await apiRef.current.getAllUsers();
      },

      async getPublicUsers() {
        return await apiRef.current.getPublicUsers();
      },
    }),
    [isInitialized, apiRef, token, user]
  );

  // We only want to run this effect once to avoid initializing the underlying
  // WebSocket multiple times (which may happen in React's strict mode). The
  // workaround is similar to this suggestion: https://stackoverflow.com/a/75126229
  const hasBegunInitializingRef = useRef(false);

  useEffect(() => {
    (async () => {
      if (!hasBegunInitializingRef.current) {
        hasBegunInitializingRef.current = true;
        await value.logIn();
        setInitialized(true);
      }
    })();
  }, [value]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
