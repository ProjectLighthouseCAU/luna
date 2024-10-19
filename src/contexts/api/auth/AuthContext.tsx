import * as convert from '@luna/contexts/api/auth/convert';
import * as generated from '@luna/contexts/api/auth/generated';
import { Login, Signup, Token, User } from '@luna/contexts/api/auth/types';
import { CreateOrUpdateUserPayload } from '@luna/contexts/api/auth/types/CreateOrUpdateUserPayload';
import { useInitRef } from '@luna/hooks/useInitRef';
import { Pagination, slicePage } from '@luna/utils/pagination';
import { errorResult, okResult, Result } from '@luna/utils/result';
import {
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
  /** Gets a user by id */
  getUserById(id: number): Promise<Result<User>>;
  /** Creates a new user */
  createUser(payload: CreateOrUpdateUserPayload): Promise<Result<void>>;
  /** Updates an existing user */
  updateUser(
    id: number,
    payload: CreateOrUpdateUserPayload
  ): Promise<Result<void>>;
  /** Deletes a user */
  deleteUser(id: number): Promise<Result<void>>;
}

export const AuthContext = createContext<AuthContextValue>({
  isInitialized: false,
  user: null,
  token: null,
  signUp: async () => errorResult('No auth context for signing up'),
  logIn: async () => errorResult('No auth context for logging in'),
  logOut: async () => errorResult('No auth context for logging out'),
  getAllUsers: async () => errorResult('No auth context for fetching users'),
  getUserById: async () => errorResult('No auth context for fetching users'),
  createUser: async () => errorResult('No auth context for fetching users'),
  updateUser: async () => errorResult('No auth context for fetching users'),
  deleteUser: async () => errorResult('No auth context for fetching users'),
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isInitialized, setInitialized] = useState(false);

  const [apiUser, setApiUser] = useState<generated.User>();
  const [apiToken, setApiToken] = useState<generated.APIToken>();

  const apiRef = useInitRef<generated.Api<unknown>>(() => {
    const authType = process.env.REACT_APP_AUTH_TYPE;
    if (authType !== 'lighthouse') {
      throw new Error('Non lighthouse auth types are no longer supported!');
    }
    return new generated.Api({
      baseUrl: process.env.REACT_APP_AUTH_SERVER_URL,
      baseApiParams: {
        credentials: 'include',
      },
    });
  });

  useEffect(() => {
    (async () => {
      try {
        if (!apiUser?.id) {
          return errorResult('Cannot fetch token without a user');
        }

        const tokenResponse = await apiRef.current.users.apiTokenDetail(
          apiUser.id
        );
        const apiToken = tokenResponse.data;
        setApiToken(apiToken);
      } catch (error) {
        console.warn(`Fetching token failed: ${await formatError(error)}`);
      }
    })();
  }, [apiUser, apiRef]);

  const user = useMemo(
    () => (apiUser ? convert.userFromApi(apiUser) : null),
    [apiUser]
  );
  const token = useMemo(
    () => (apiToken ? convert.tokenFromApi(apiToken) : null),
    [apiToken]
  );

  const value: AuthContextValue = useMemo(
    () => ({
      isInitialized,
      user,
      token,

      async signUp(signup) {
        try {
          const signupResponse = await apiRef.current.register.registerCreate(
            convert.signupToApi(signup)
          );
          const apiUser = signupResponse.data;
          setApiUser(apiUser);
          return okResult(convert.userFromApi(apiUser));
        } catch (error) {
          return errorResult(`Signup failed: ${await formatError(error)}`);
        }
      },

      async logIn(login) {
        try {
          const apiUserResponse = await apiRef.current.login.loginCreate(
            convert.loginToApi(login)
          );
          const apiUser = apiUserResponse.data;
          setApiUser(apiUser);
          return okResult(convert.userFromApi(apiUser));
        } catch (error) {
          return errorResult(`Login failed: ${await formatError(error)}`);
        }
      },

      async logOut() {
        try {
          await apiRef.current.logout.logoutCreate();
          setApiUser(undefined);
          return okResult(undefined);
        } catch (error) {
          return errorResult(`Logout failed: ${await formatError(error)}`);
        }
      },

      async getAllUsers(pagination) {
        try {
          const apiUsersResponse = await apiRef.current.users.usersList();
          let apiUsers: generated.User[] = apiUsersResponse.data;

          // Emulate pagination since Heimdall doesn't support it
          // TODO: Implement pagination in Heimdall and remove this
          apiUsers = slicePage(apiUsers, pagination);

          return okResult(apiUsers.map(convert.userFromApi));
        } catch (error) {
          return errorResult(
            `Fetching all users failed: ${await formatError(error)}`
          );
        }
      },

      async getUserById(id: number) {
        try {
          const apiUserResponse = await apiRef.current.users.getUserByName(id);
          return okResult(convert.userFromApi(apiUserResponse.data));
        } catch (error) {
          return errorResult(
            `Fetching user with id ${id} failed: ${await formatError(error)}`
          );
        }
      },

      async createUser(payload: CreateOrUpdateUserPayload) {
        try {
          await apiRef.current.users.usersCreate(
            convert.createOrUpdateUserPayloadToApi(payload)
          );
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Creating user failed: ${await formatError(error)}`
          );
        }
      },

      async updateUser(id: number, payload: CreateOrUpdateUserPayload) {
        try {
          await apiRef.current.users.usersUpdate(
            id,
            convert.createOrUpdateUserPayloadToApi(payload)
          );
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Updating user with id ${id} failed: ${await formatError(error)}`
          );
        }
      },

      async deleteUser(id: number) {
        try {
          await apiRef.current.users.usersDelete(id);
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Deleting user with id ${id} failed: ${await formatError(error)}`
          );
        }
      },
    }),
    [apiRef, isInitialized, token, user]
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

async function formatError(error: any): Promise<string> {
  if (error instanceof Response) {
    const body = await error.text();
    if (body.length > 0) {
      return body;
    } else {
      return `${error.status} ${error.statusText}`;
    }
  } else {
    return `${error}`;
  }
}
