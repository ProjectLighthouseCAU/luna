import { ModelService } from '@luna/services/model/ModelService';
import { UserModel } from '@luna/services/model/UserModel';
import { sleep } from '@luna/utils/async';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';

export class MockModelService implements ModelService {
  async logIn(username: string, token: string): Promise<boolean> {
    return true;
  }

  async *streamModel(user: string): AsyncIterable<UserModel> {
    while (true) {
      yield {
        frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES).map(() =>
          Math.floor(Math.random() * 255)
        ),
      };
      await sleep(500);
    }
  }
}
