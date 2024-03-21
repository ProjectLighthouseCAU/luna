import { ModelService } from '@luna/services/model/ModelService';
import { UserModel } from '@luna/services/model/UserModel';
import { Lighthouse, connect } from 'nighthouse/browser';

export class StandardModelService implements ModelService {
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
