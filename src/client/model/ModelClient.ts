import { UserModel } from '@luna/client/model/UserModel';

/**
 * A facility that talks to a model servers, i.e. streams resources.
 */
export interface ModelClient {
  /** Authenticates with the given token. Returns whether this succeeded. */
  logIn(token: string): Promise<boolean>;

  /** Streams the given user's display model. */
  streamModel(user: string): AsyncIterable<UserModel>;
}
