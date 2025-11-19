import * as convert from '@luna/contexts/api/auth/convert';
import * as generated from '@luna/contexts/api/auth/generated';
import {
  Login,
  RegistrationKey,
  Role,
  Signup,
  Token,
  User,
} from '@luna/contexts/api/auth/types';
import { CreateOrUpdateRegistrationKeyPayload } from '@luna/contexts/api/auth/types/CreateOrUpdateRegistrationKeyPayload';
import { CreateOrUpdateRolePayload } from '@luna/contexts/api/auth/types/CreateOrUpdateRolePayload';
import { CreateOrUpdateUserPayload } from '@luna/contexts/api/auth/types/CreateOrUpdateUserPayload';
import { UpdateTokenPayload } from '@luna/contexts/api/auth/types/UpdateTokenPayload';
import { useInitRef } from '@luna/hooks/useInitRef';
import { Pagination, slicePage } from '@luna/utils/pagination';
import { errorResult, okResult, Result } from '@luna/utils/result';
import {
  createContext,
  ReactNode,
  useCallback,
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

  /** Fetches the token for the given user. */
  getToken(id: number): Promise<Result<Token>>;

  /** Invalidates the current token of the given (or current if none is provided) user and creates a new one. */
  cycleToken(id?: number): Promise<Result<void>>;

  /** Updates a  */
  updateToken(id: number, payload: UpdateTokenPayload): Promise<Result<void>>;

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

  /** Fetches all roles */
  getAllRoles(): Promise<Result<Role[]>>;

  /** Gets a role by id */
  getRoleById(id: number): Promise<Result<Role>>;

  /** Creates a new role */
  createRole(payload: CreateOrUpdateRolePayload): Promise<Result<void>>;

  /** Updates an existing role */
  updateRole(
    id: number,
    payload: CreateOrUpdateRolePayload
  ): Promise<Result<void>>;

  /** Deletes a role */
  deleteRole(id: number): Promise<Result<void>>;

  /** Fetches all registration keys */
  getAllRegistrationKeys(): Promise<Result<RegistrationKey[]>>;

  /** Gets a registration key by id */
  getRegistrationKeyById(id: number): Promise<Result<RegistrationKey>>;

  /** Creates a new registration key */
  createRegistrationKey(
    payload: CreateOrUpdateRegistrationKeyPayload
  ): Promise<Result<void>>;

  /** Updates an existing registration key */
  updateRegistrationKey(
    id: number,
    payload: CreateOrUpdateRegistrationKeyPayload
  ): Promise<Result<void>>;

  /** Deletes a registration key */
  deleteRegistrationKey(id: number): Promise<Result<void>>;
}

export const AuthContext = createContext<AuthContextValue>({
  isInitialized: false,
  user: null,
  token: null,
  signUp: async () => errorResult('No auth context for signing up'),
  logIn: async () => errorResult('No auth context for logging in'),
  logOut: async () => errorResult('No auth context for logging out'),
  getToken: async () => errorResult('No auth context for fetching token'),
  cycleToken: async () => errorResult('No auth context for cycling token'),
  updateToken: async () => errorResult('No auth context for updating token'),
  getAllUsers: async () => errorResult('No auth context for fetching users'),
  getUserById: async () => errorResult('No auth context for fetching user'),
  createUser: async () => errorResult('No auth context for creating user'),
  updateUser: async () => errorResult('No auth context for updating user'),
  deleteUser: async () => errorResult('No auth context for deleting user'),
  getAllRoles: async () => errorResult('No auth context for fetching roles'),
  getRoleById: async () => errorResult('No auth context for fetching role'),
  createRole: async () => errorResult('No auth context for creating role'),
  updateRole: async () => errorResult('No auth context for updating role'),
  deleteRole: async () => errorResult('No auth context for deleting role'),
  getAllRegistrationKeys: async () =>
    errorResult('No auth context for fetching registration keys'),
  getRegistrationKeyById: async () =>
    errorResult('No auth context for fetching registration key'),
  createRegistrationKey: async () =>
    errorResult('No auth context for creating registration key'),
  updateRegistrationKey: async () =>
    errorResult('No auth context for updating registration key'),
  deleteRegistrationKey: async () =>
    errorResult('No auth context for deleting registration key'),
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

  const updateToken = useCallback(async () => {
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
  }, [apiRef, apiUser?.id]);

  useEffect(() => {
    updateToken();
  }, [apiUser, apiRef, updateToken]);

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
          setApiToken(undefined);
          return okResult(undefined);
        } catch (error) {
          return errorResult(`Logout failed: ${await formatError(error)}`);
        }
      },

      async getToken(id) {
        try {
          if (!id) {
            return errorResult('Cannot fetch token without a user');
          }
          const result = await apiRef.current.users.apiTokenDetail(id);
          return okResult(convert.tokenFromApi(result.data));
        } catch (error) {
          return errorResult(
            `Fetching token failed: ${await formatError(error)}`
          );
        }
      },

      async cycleToken(id = apiUser?.id) {
        try {
          if (!id) {
            return errorResult('Cannot cycle token without a user');
          }
          await apiRef.current.users.apiTokenDelete(id);
          await updateToken();
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Cycling token failed: ${await formatError(error)}`
          );
        }
      },

      async updateToken(id: number, payload: UpdateTokenPayload) {
        try {
          await apiRef.current.users.apiTokenUpdate(id, payload);
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Updating token of user with id ${id} to permanent state "${payload}" failed: ${await formatError(error)}`
          );
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

      async getAllRoles() {
        try {
          const apiRolesResponse = await apiRef.current.roles.rolesList();
          let apiRoles: generated.Role[] = apiRolesResponse.data;
          return okResult(apiRoles.map(convert.roleFromApi));
        } catch (error) {
          return errorResult(
            `Fetching all roles failed: ${await formatError(error)}`
          );
        }
      },

      async getRoleById(id: number) {
        try {
          const apiRoleResponse = await apiRef.current.roles.rolesDetail(id);
          return okResult(convert.roleFromApi(apiRoleResponse.data));
        } catch (error) {
          return errorResult(
            `Fetching role with id ${id} failed: ${await formatError(error)}`
          );
        }
      },

      async createRole(payload: CreateOrUpdateRolePayload) {
        try {
          await apiRef.current.roles.rolesCreate(
            convert.createOrUpdateRolePayloadToApi(payload)
          );
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Creating role failed: ${await formatError(error)}`
          );
        }
      },

      async updateRole(id: number, payload: CreateOrUpdateRolePayload) {
        try {
          await apiRef.current.roles.rolesUpdate(
            id,
            convert.createOrUpdateRolePayloadToApi(payload)
          );
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Updating role with id ${id} failed: ${await formatError(error)}`
          );
        }
      },

      async deleteRole(id: number) {
        try {
          await apiRef.current.roles.rolesDelete(id);
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Deleting role with id ${id} failed: ${await formatError(error)}`
          );
        }
      },

      async getAllRegistrationKeys() {
        try {
          const apiRegKeysResponse =
            await apiRef.current.registrationKeys.registrationKeysList();
          let apiRegKeys: generated.Role[] = apiRegKeysResponse.data;
          return okResult(apiRegKeys.map(convert.registrationKeyFromApi));
        } catch (error) {
          return errorResult(
            `Fetching all registration keys failed: ${await formatError(error)}`
          );
        }
      },

      async getRegistrationKeyById(id: number) {
        try {
          const apiRegKeyResponse =
            await apiRef.current.registrationKeys.registrationKeysDetail(id);
          return okResult(
            convert.registrationKeyFromApi(apiRegKeyResponse.data)
          );
        } catch (error) {
          return errorResult(
            `Fetching registration key with id ${id} failed: ${await formatError(error)}`
          );
        }
      },

      async createRegistrationKey(
        payload: CreateOrUpdateRegistrationKeyPayload
      ) {
        try {
          await apiRef.current.registrationKeys.registrationKeysCreate(
            convert.createOrUpdateRegistrationKeyPayloadToApi(payload)
          );
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Creating registration key failed: ${await formatError(error)}`
          );
        }
      },

      async updateRegistrationKey(
        id: number,
        payload: CreateOrUpdateRegistrationKeyPayload
      ) {
        try {
          await apiRef.current.registrationKeys.registrationKeysUpdate(
            id,
            convert.createOrUpdateRegistrationKeyPayloadToApi(payload)
          );
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Updating registration key with id ${id} failed: ${await formatError(error)}`
          );
        }
      },

      async deleteRegistrationKey(id: number) {
        try {
          await apiRef.current.registrationKeys.registrationKeysDelete(id);
          return okResult(undefined);
        } catch (error) {
          return errorResult(
            `Deleting registration key with id ${id} failed: ${await formatError(error)}`
          );
        }
      },
    }),
    [apiRef, apiUser?.id, isInitialized, token, updateToken, user]
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
