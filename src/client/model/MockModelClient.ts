import { ModelClient } from '@luna/client/model/ModelClient';
import { UserModel } from '@luna/client/model/UserModel';
import { sleep } from '@luna/utils/async';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';

export class MockModelClient implements ModelClient {
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
