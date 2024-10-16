import { ModelApi } from '@luna/api/model/ModelApi';
import { UserModel } from '@luna/contexts/api/model/types';

export class NullModelApi implements ModelApi {
  async logIn(username: string, token: string): Promise<boolean> {
    return false;
  }

  async *streamModel(user: string): AsyncIterable<UserModel> {}
}
