import { Login, Pagination, Signup, Token, User } from '@luna/api/auth/types';
import { Result } from '@luna/utils/result';

/**
 * A facility that talks to an authentication backend.
 */
export interface AuthApi {
  /** Sign up a new account using a registration key. */
  signUp(signup: Signup): Promise<Result<User>>;

  /** Authenticates with the given credentials. Returns the logged in user on success. */
  logIn(login?: Login): Promise<Result<User>>;

  /** Deauthenticates. */
  logOut(): Promise<Result<void>>;

  /** Fetches a list of public users. */
  getPublicUsers(pagination?: Pagination): Promise<Result<User[]>>;

  /** Fetches a list of all users. Generally admin-only. */
  getAllUsers(pagination?: Pagination): Promise<Result<User[]>>;

  /** Fetches the API token for the authenticated user. */
  getToken(): Promise<Result<Token>>;
}
