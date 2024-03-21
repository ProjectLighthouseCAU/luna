import { ModelBackend } from '@luna/backends/model/ModelBackend';
import { UserModel } from '@luna/backends/model/UserModel';

export class NullModelBackend implements ModelBackend {
  async logIn(username: string, token: string): Promise<boolean> {
    return false;
  }

  async *streamModel(user: string): AsyncIterable<UserModel> {}
}
