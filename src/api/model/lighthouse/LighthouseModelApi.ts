import { ModelApi } from '@luna/api/model/ModelApi';
import { UserModel } from '@luna/api/model/types';
import { Lock } from '@luna/utils/semaphore';
import { Lighthouse, connect } from 'nighthouse/browser';

export class LighthouseModelApi implements ModelApi {
  private client?: Lighthouse;
  private clientLock = new Lock();

  constructor(
    private readonly url: string = 'wss://lighthouse.uni-kiel.de/websocket'
  ) {}

  async logIn(username: string, token: string): Promise<boolean> {
    try {
      await this.clientLock.acquire();

      if (this.client !== undefined) {
        await this.client.close();
      }

      this.client = connect({
        url: this.url,
        auth: { USER: username, TOKEN: token },
      });
      await this.client.ready();

      return true;
    } finally {
      this.clientLock.release();
    }
  }

  async *streamModel(user: string): AsyncIterable<UserModel> {
    if (this.client) {
      try {
        await this.clientLock.acquire();

        for await (const message of this.client.streamModel(user)) {
          // TODO: Handle events too, perhaps by yielding a sum type of frames and events
          const payload = message.PAYL;
          if (payload instanceof Uint8Array) {
            yield { frame: payload };
          }
        }
      } finally {
        this.clientLock.release();
      }
    }
  }

  async *streamResource(path: string[]): AsyncIterable<unknown> {
    if (this.client) {
      try {
        await this.clientLock.acquire();

        for await (const message of this.client.stream(path, {})) {
          yield message.PAYL;
        }
      } finally {
        this.clientLock.release();
      }
    }
  }
}
