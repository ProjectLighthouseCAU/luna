import { UserModel } from '@luna/client/model/UserModel';

/**
 * A facility that talks to a model servers, i.e. streams resources.
 */
export interface ModelClient {
  streamModel(user: string): AsyncIterable<UserModel>;
}
