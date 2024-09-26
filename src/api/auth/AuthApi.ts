import { Token } from '@luna/api/auth/types/Token';
import { User } from '@luna/api/auth/types/User';

/**
 * A facility that talks to an authentication backend.
 */
export interface AuthApi {
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

  /** Fetches a list of public users. */
  getPublicUsers(): Promise<User[]>;

  /** Fetches a list of all users. Generally admin-only. */
  getAllUsers(): Promise<User[]>;

  /** Fetches the API token for the authenticated user. */
  getToken(): Promise<Token | null>;
}
