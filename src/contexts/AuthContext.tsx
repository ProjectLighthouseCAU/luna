import { AuthApi } from '@luna/api/auth/AuthApi';
import { LegacyAuthApi } from '@luna/api/auth/LegacyAuthApi';
import { LighthouseAuthApi } from '@luna/api/auth/lighthouse';
import { MockAuthApi } from '@luna/api/auth/MockAuthApi';
import { NullAuthApi } from '@luna/api/auth/NullAuthApi';
import { Login, Signup, Token, User } from '@luna/api/auth/types';
import { useInitRef } from '@luna/hooks/useInitRef';
import { Pagination } from '@luna/utils/pagination';
import { errorResult, getOrThrow, okResult, Result } from '@luna/utils/result';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface AuthContextValue {
  /** Whether the authentication has finished initializing. */
  readonly isInitialized: boolean;

  /** The authenticated user. */
  readonly user: User | null;

  /** The current token. */
  readonly token: Token | null;

  /** Sign up a new account using a registration key. */
  signUp(signup: Signup): Promise<Result<User>>;

  /** Authenticates with the given credentials. Returns the user on success. */
  logIn(login?: Login): Promise<Result<User>>;

  /** Deauthenticates. Returns whether this succeeded. */
  logOut(): Promise<Result<void>>;

  /** Fetches all users. */
  getAllUsers(pagination?: Pagination): Promise<Result<User[]>>;

  /** Fetches the public users. */
  getPublicUsers(pagination?: Pagination): Promise<Result<User[]>>;
}

export const AuthContext = createContext<AuthContextValue>({
  isInitialized: false,
  user: null,
  token: null,
  signUp: async () => errorResult('No auth context for signing up'),
  logIn: async () => errorResult('No auth context for logging in'),
  logOut: async () => errorResult('No auth context for logging out'),
  getAllUsers: async () => errorResult('No auth context for fetching users'),
  getPublicUsers: async () => errorResult('No auth context for fetching users'),
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

  const value: AuthContextValue = useMemo(
    () => ({
      isInitialized,
      user,
      token,

      async signUp(signup) {
        try {
          const user = getOrThrow(await apiRef.current.signUp(signup));
          const token = getOrThrow(await apiRef.current.getToken());

          setUser(user);
          setToken(token);

          return okResult(user);
        } catch (error) {
          return errorResult(error);
        }
      },

      async logIn(login) {
        try {
          const user = getOrThrow(await apiRef.current.logIn(login));
          const token = getOrThrow(await apiRef.current.getToken());

          setUser(user);
          setToken(token);

          return okResult(user);
        } catch (error) {
          return errorResult(error);
        }
      },

      async logOut() {
        try {
          getOrThrow(await apiRef.current.logOut());
          setUser(null);
          return okResult(undefined);
        } catch (error) {
          return errorResult(error);
        }
      },

      async getAllUsers(pagination) {
        return await apiRef.current.getAllUsers(pagination);
      },

      async getPublicUsers(pagination) {
        return await apiRef.current.getPublicUsers(pagination);
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
