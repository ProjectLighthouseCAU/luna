import { ModelClient } from '@luna/client/model/ModelClient';
import { UserModel } from '@luna/client/model/UserModel';

export class NullModelClient implements ModelClient {
  async *streamModel(user: string): AsyncIterable<UserModel> {}
}
