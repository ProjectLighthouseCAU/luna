/**
 * A facility that talks to an authentication backend.
 */
export interface AuthClient {
  /** The username of the authenticated user. */
  readonly username?: string;

  /** Authenticates with the given credentials. */
  login(username: string, password: string): void;

  /** Fetches a list of public usernames. */
  getPublicUsers(): string[];
}
