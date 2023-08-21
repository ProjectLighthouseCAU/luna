/**
 * A facility that talks to an authentication backend.
 */
export interface AuthClient {
  /** Authenticates with the given credentials. */
  login(username: string, password: string): void;

  /** Fetches a list of public usernames. */
  getPublicUsers(): string[];
}
