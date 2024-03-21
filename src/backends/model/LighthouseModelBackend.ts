import { ModelBackend } from '@luna/backends/model/ModelBackend';
import { UserModel } from '@luna/backends/model/UserModel';
import { Lighthouse, connect } from 'nighthouse/browser';

export class LighthouseModelBackend implements ModelBackend {
  private client?: Lighthouse;

  constructor(
    private readonly url: string = 'wss://lighthouse.uni-kiel.de/websocket'
  ) {}

  async logIn(username: string, token: string): Promise<boolean> {
    if (this.client !== undefined) {
      await this.client.close();
    }

    this.client = connect({
      url: this.url,
      auth: { USER: username, TOKEN: token },
    });
    await this.client.ready();

    return true;
  }

  async *streamModel(user: string): AsyncIterable<UserModel> {
    if (this.client) {
      for await (const message of this.client.streamModel(user)) {
        // TODO: Handle events too, perhaps by yielding a sum type of frames and events
        const payload = message.PAYL;
        if (payload instanceof Uint8Array) {
          yield { frame: payload };
        }
      }
    }
  }

  async *streamResource(path: string[]): AsyncIterable<unknown> {
    if (this.client) {
      for await (const message of this.client.stream(path, {})) {
        yield message.PAYL;
      }
    }
  }
}
