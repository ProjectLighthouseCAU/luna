import { ModelClient } from '@luna/client/model/ModelClient';
import { UserModel } from '@luna/client/model/UserModel';

export class NullModelClient implements ModelClient {
  async logIn(token: string): Promise<boolean> {
    return false;
  }

  async *streamModel(user: string): AsyncIterable<UserModel> {}
}
