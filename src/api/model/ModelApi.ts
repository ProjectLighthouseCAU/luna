import { UserModel } from '@luna/api/model/UserModel';

/**
 * A facility that talks to a model servers, i.e. streams resources.
 */
export interface ModelApi {
  /** Authenticates with the given token. Returns whether this succeeded. */
  logIn(username: string, token: string): Promise<boolean>;

  /** Streams the given user's display model. */
  streamModel(user: string): AsyncIterable<UserModel>;
}
