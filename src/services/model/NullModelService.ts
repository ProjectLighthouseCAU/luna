import { ModelService } from '@luna/services/model/ModelService';
import { UserModel } from '@luna/services/model/UserModel';

export class NullModelService implements ModelService {
  async logIn(username: string, token: string): Promise<boolean> {
    return false;
  }

  async *streamModel(user: string): AsyncIterable<UserModel> {}
}
