import { AuthBackend } from '@luna/backends/auth/AuthBackend';
import { LegacyAuthBackend } from '@luna/backends/auth/LegacyAuthBackend';
import { MockAuthBackend } from '@luna/backends/auth/MockAuthBackend';
import { NullAuthBackend } from '@luna/backends/auth/NullAuthBackend';
import { Token } from '@luna/backends/auth/Token';
import { User } from '@luna/backends/auth/User';
import { useInitRef } from '@luna/hooks/useInitRef';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface Auth {
  /** Whether auth is still initializing. */
  readonly isInitializing: boolean;

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

  /** Authenticates with the given credentials. Returns whether this succeeded. */
  logIn(username?: string, password?: string): Promise<User | null>;

  /** Deauthenticates. Returns whether this succeeded. */
  logOut(): Promise<boolean>;

  /** Fetches all users. */
  getAllUsers(): Promise<User[]>;

  /** Fetches the public users. */
  getPublicUsers(): Promise<User[]>;
}

export const AuthContext = createContext<Auth>({
  isInitializing: true,
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
  const [isInitializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<Token | null>(null);

  const backendRef = useInitRef<AuthBackend>(() => {
    const authType = process.env.REACT_APP_AUTH_TYPE;
    switch (authType) {
      case 'legacy':
        return new LegacyAuthBackend(process.env.REACT_APP_AUTH_SERVER_URL);
      case 'mock':
        return new MockAuthBackend();
      case 'null':
        return new NullAuthBackend();
      default:
        throw new Error(
          `Could not instantiate unknown auth type '${authType}'`
        );
    }
  });

  // TODO: Deal with case-sensitivity, what if the user logs in with a different casing?

  const value: Auth = useMemo(
    () => ({
      isInitializing,
      user,
      token,
      async signUp(registrationKey, username, password) {
        const user = await backendRef.current.signUp(
          registrationKey,
          username,
          password
        );
        if (user !== null) {
          setUser(user);
          setToken(await backendRef.current.getToken());
        }
        return user;
      },

      async logIn(username, password) {
        const user = await backendRef.current.logIn(username, password);
        if (user !== null) {
          setUser(user);
          setToken(await backendRef.current.getToken());
        }
        return user;
      },

      async logOut() {
        if (await backendRef.current.logOut()) {
          setUser(null);
          return true;
        }
        return false;
      },

      async getAllUsers() {
        return await backendRef.current.getAllUsers();
      },

      async getPublicUsers() {
        return await backendRef.current.getPublicUsers();
      },
    }),
    [isInitializing, backendRef, token, user]
  );

  useEffect(() => {
    (async () => {
      if (isInitializing) {
        await value.logIn();
        setInitializing(false);
      }
    })();
  }, [isInitializing, value]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
