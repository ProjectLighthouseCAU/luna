/**
 * A facility that talks to a model servers, i.e. streams resources.
 */
export interface ModelBackend {
  /** Authenticates with the given token. Returns whether this succeeded. */
  logIn(username: string, token: string): Promise<boolean>;

  /** Streams the resource at the given path. */
  stream(path: string[]): AsyncIterable<unknown>;
}
