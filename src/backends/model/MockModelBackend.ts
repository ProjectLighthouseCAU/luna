import { ModelBackend } from '@luna/backends/model/ModelBackend';
import { sleep } from '@luna/utils/async';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';

export class MockModelBackend implements ModelBackend {
  async logIn(username: string, token: string): Promise<boolean> {
    return true;
  }

  async *stream(path: string[]): AsyncIterable<unknown> {
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
