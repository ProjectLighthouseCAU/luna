import { UserModel } from '@luna/model/UserModel';

/**
 * A facility that talks to a model servers, i.e. streams resources.
 */
export interface ModelClient {
  streamModel(user: string): AsyncIterable<UserModel>;
}
