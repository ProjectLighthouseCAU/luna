/**
 * A facility that talks to an authentication backend.
 */
export interface AuthClient {
  /** Authenticates with the given credentials. */
  logIn(username: string, password: string): void;

  /** Deauthenticates. */
  logOut(): void;

  /** Fetches a list of public usernames. */
  getPublicUsers(): string[];
}
