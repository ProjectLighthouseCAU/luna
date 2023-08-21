/**
 * A facility that talks to an authentication backend.
 */
export interface AuthClient {
  /** Authenticates with the given credentials. Returns whether this succeeded. */
  logIn(username: string, password: string): boolean;

  /** Deauthenticates. Returns whether this succeeded. */
  logOut(): boolean;

  /** Fetches a list of public usernames. */
  getPublicUsers(): string[];
}
