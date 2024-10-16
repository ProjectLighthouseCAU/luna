/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** API token that allows access to the websocket API (beacon) and probably other APIs in the future */
export interface APIToken {
  /** the actual API token */
  api_token?: string;
  /** expiration date of this token */
  expires_at?: string;
  /** roles associated with this token */
  roles?: string[];
  /** unique username associated with this token */
  username?: string;
}

export interface CreateOrUpdateRolePayload {
  name?: string;
}

export interface CreateOrUpdateUserPayload {
  email?: string;
  password?: string;
  permanent_api_token?: boolean;
  username?: string;
}

export interface CreateRegistrationKeyPayload {
  description?: string;
  expires_at?: string;
  key?: string;
  permanent?: boolean;
}

export interface LoginPayload {
  password?: string;
  username?: string;
}

export interface RegisterPayload {
  email?: string;
  password?: string;
  /** snake case naming for decoding of x-www-form-urlencoded bodies */
  registration_key?: string;
  username?: string;
}

/** A registration key that can be permanent or expire at a specified date and time with which new users can register an account */
export interface RegistrationKey {
  /** ISO 8601 datetime */
  created_at?: string;
  /** a description for this registration key */
  description?: string;
  /** expiration date in ISO 8601 datetime */
  expires_at?: string;
  /** id (primary key) */
  id?: number;
  /** unique registration key */
  key?: string;
  /** if set, ignores the expires_at field and never expires this key */
  permanent?: boolean;
  /** ISO 8601 datetime */
  updated_at?: string;
}

/** A named role that describes a group of users sharing the same permissions */
export interface Role {
  /** ISO 8601 datetime */
  created_at?: string;
  /** id (primary key) */
  id?: number;
  /** unique name of the role */
  name?: string;
  /** ISO 8601 datetime */
  updated_at?: string;
}

export interface UpdateRegistrationKeyPayload {
  description?: string;
  expires_at?: string;
  permanent?: boolean;
}

/** User account information including username, email, last login date and time, permanent API token flag, registration key (if user registered with a key) and roles */
export interface User {
  /** ISO 8601 datetime */
  created_at?: string;
  /** can be empty */
  email?: string;
  /** id (primary key) */
  id?: number;
  /** ISO 8601 datetime TODO: redundant with UpdatedAt but only because LastLogin is updated on login */
  last_login?: string;
  /** if set the users API token never automatically expires */
  permanent_api_token?: boolean;
  /** omitted if null (when user was created and not registered) */
  registration_key?: RegistrationKey;
  /** ISO 8601 datetime */
  updated_at?: string;
  /** must be unique */
  username?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(key => 'undefined' !== typeof query[key]);
    return keys
      .map(key => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async response => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then(data => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch(e => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Heimdall Lighthouse API
 * @version 0.1
 * @contact
 *
 * This is the REST API of Project Lighthouse that manages users, roles, registration keys, API tokens and everything about authentication and authorization.
 * NOTE: This API is an early alpha version that still needs a lot of testing (unit tests, end-to-end tests and security tests)
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  login = {
    /**
     * @description Log in with username and password (sets a cookie with the session id). Returns the full user information if the login was successful or the user is already logged in.
     *
     * @tags Users
     * @name LoginCreate
     * @summary Login
     * @request POST:/login
     */
    loginCreate: (payload: LoginPayload, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/login`,
        method: 'POST',
        body: payload,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  logout = {
    /**
     * @description Log out of the current session
     *
     * @tags Users
     * @name LogoutCreate
     * @summary Logout
     * @request POST:/logout
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/logout`,
        method: 'POST',
        type: ContentType.Json,
        ...params,
      }),
  };
  register = {
    /**
     * @description Registers a new user using a registration key
     *
     * @tags Users
     * @name RegisterCreate
     * @summary Register user
     * @request POST:/register
     */
    registerCreate: (payload: RegisterPayload, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/register`,
        method: 'POST',
        body: payload,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  registrationKeys = {
    /**
     * @description Get a list of all registration keys or query a single registration key by key (returns single object instead of list)
     *
     * @tags RegistrationKeys
     * @name RegistrationKeysList
     * @summary Get all registration keys or query by key
     * @request GET:/registration-keys
     */
    registrationKeysList: (
      query?: {
        /** Registration Key */
        key?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<RegistrationKey[], void>({
        path: `/registration-keys`,
        method: 'GET',
        query: query,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Create a new registration key
     *
     * @tags RegistrationKeys
     * @name RegistrationKeysCreate
     * @summary Create registration key
     * @request POST:/registration-keys
     */
    registrationKeysCreate: (payload: CreateRegistrationKeyPayload, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/registration-keys`,
        method: 'POST',
        body: payload,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get a registration key by its id
     *
     * @tags RegistrationKeys
     * @name RegistrationKeysDetail
     * @summary Get registration key by id
     * @request GET:/registration-keys/{id}
     */
    registrationKeysDetail: (id: number, params: RequestParams = {}) =>
      this.request<RegistrationKey, void>({
        path: `/registration-keys/${id}`,
        method: 'GET',
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Upadte a registration key by its id
     *
     * @tags RegistrationKeys
     * @name RegistrationKeysUpdate
     * @summary Update registration key
     * @request PUT:/registration-keys/{id}
     */
    registrationKeysUpdate: (id: number, payload: UpdateRegistrationKeyPayload, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/registration-keys/${id}`,
        method: 'PUT',
        body: payload,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Delete a registration key by its id
     *
     * @tags RegistrationKeys
     * @name RegistrationKeysDelete
     * @summary Delete registration key
     * @request DELETE:/registration-keys/{id}
     */
    registrationKeysDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/registration-keys/${id}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * @description Get a list of users that registered using this registration key by its id. NOTE: registration_key is not included for users
     *
     * @tags RegistrationKeys
     * @name UsersDetail
     * @summary Get users of registration key
     * @request GET:/registration-keys/{id}/users
     */
    usersDetail: (id: number, params: RequestParams = {}) =>
      this.request<User[], void>({
        path: `/registration-keys/${id}/users`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  roles = {
    /**
     * @description Get a list of all roles or query a single role by name (returns single object instead of list)
     *
     * @tags Roles
     * @name RolesList
     * @summary Get all roles or query by name
     * @request GET:/roles
     */
    rolesList: (
      query?: {
        /** Role name */
        name?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<Role, void>({
        path: `/roles`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Create a new role
     *
     * @tags Roles
     * @name RolesCreate
     * @summary Create role
     * @request POST:/roles
     */
    rolesCreate: (payload: CreateOrUpdateRolePayload, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/roles`,
        method: 'POST',
        body: payload,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get a role by its role id
     *
     * @tags Roles
     * @name RolesDetail
     * @summary Get role by id
     * @request GET:/roles/{id}
     */
    rolesDetail: (id: number, params: RequestParams = {}) =>
      this.request<Role, void>({
        path: `/roles/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Update a new role by its user id
     *
     * @tags Roles
     * @name RolesUpdate
     * @summary Update role
     * @request PUT:/roles/{id}
     */
    rolesUpdate: (id: number, payload: CreateOrUpdateRolePayload, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/roles/${id}`,
        method: 'PUT',
        body: payload,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Delete a role by its role id
     *
     * @tags Roles
     * @name RolesDelete
     * @summary Delete role
     * @request DELETE:/roles/{id}
     */
    rolesDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/roles/${id}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * @description Get a list of users that have a role by its role id. NOTE: registration_key is not included for users
     *
     * @tags Roles
     * @name UsersDetail
     * @summary Get users of role
     * @request GET:/roles/{id}/users
     */
    usersDetail: (id: number, params: RequestParams = {}) =>
      this.request<User[], void>({
        path: `/roles/${id}/users`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Add a user (by its user id) to a role (by its role id)
     *
     * @tags Roles
     * @name UsersUpdate
     * @summary Add user to role
     * @request PUT:/roles/{roleid}/users/{userid}
     */
    usersUpdate: (roleid: number, userid: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/roles/${roleid}/users/${userid}`,
        method: 'PUT',
        ...params,
      }),

    /**
     * @description Remove a user (by its user id) from a role (by its role id)
     *
     * @tags Roles
     * @name UsersDelete
     * @summary Remove user from role
     * @request DELETE:/roles/{roleid}/users/{userid}
     */
    usersDelete: (roleid: number, userid: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/roles/${roleid}/users/${userid}`,
        method: 'DELETE',
        ...params,
      }),
  };
  users = {
    /**
     * @description Get a list of all users or query a single user by name (returns single object instead of list). NOTE: registration_key is only included when querying a single user
     *
     * @tags Users
     * @name UsersList
     * @summary Get all users or query by name
     * @request GET:/users
     */
    usersList: (
      query?: {
        /** Username */
        name?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<User[], void>({
        path: `/users`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Creates a new user
     *
     * @tags Users
     * @name UsersCreate
     * @summary Create user
     * @request POST:/users
     */
    usersCreate: (payload: CreateOrUpdateUserPayload, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users`,
        method: 'POST',
        body: payload,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get a user by its user id
     *
     * @tags Users
     * @name GetUserByName
     * @summary Get user by id
     * @request GET:/users/{id}
     */
    getUserByName: (id: number, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/users/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Updates a user (always updates all fields, partial updates currently not supported)
     *
     * @tags Users
     * @name UsersUpdate
     * @summary Update user
     * @request PUT:/users/{id}
     */
    usersUpdate: (id: number, payload: CreateOrUpdateUserPayload, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/${id}`,
        method: 'PUT',
        body: payload,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Deletes a user given a user id
     *
     * @tags Users
     * @name UsersDelete
     * @summary Delete user
     * @request DELETE:/users/{id}
     */
    usersDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/${id}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * @description Given a valid user id, returns the username, API token, associated roles and expiration date
     *
     * @tags Users
     * @name ApiTokenDetail
     * @summary Get a user's API token
     * @request GET:/users/{id}/api-token
     */
    apiTokenDetail: (id: number, params: RequestParams = {}) =>
      this.request<APIToken, void>({
        path: `/users/${id}/api-token`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Given a valid user id, invalidates the current API token and generates a new one
     *
     * @tags Users
     * @name ApiTokenDelete
     * @summary Renew a user's API token
     * @request DELETE:/users/{id}/api-token
     */
    apiTokenDelete: (id: number, params: RequestParams = {}) =>
      this.request<APIToken, void>({
        path: `/users/${id}/api-token`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * @description Get a list of roles that a user posesses
     *
     * @tags Users
     * @name RolesDetail
     * @summary Get roles of user
     * @request GET:/users/{id}/roles
     */
    rolesDetail: (id: number, params: RequestParams = {}) =>
      this.request<Role[], void>({
        path: `/users/${id}/roles`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
}
