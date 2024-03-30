import { ModelBackend } from '@luna/backends/model/ModelBackend';
import { Semaphore } from '@luna/utils/semaphore';
import { Lighthouse, connect } from 'nighthouse/browser';

export class LighthouseModelBackend implements ModelBackend {
  private client?: Lighthouse;
  private username?: string;
  private readySemaphore = new Semaphore(0);

  constructor(
    private readonly url: string = 'wss://lighthouse.uni-kiel.de/websocket'
  ) {}

  async logIn(username: string, token: string): Promise<boolean> {
    if (this.username === username) {
      return true;
    }

    if (this.client !== undefined) {
      await this.client.close();
    }

    this.client = connect({
      url: this.url,
      auth: { USER: username, TOKEN: token },
    });

    await this.client.ready();
    this.readySemaphore.signal();
    this.username = username;

    return true;
  }

  async *stream(path: string[]): AsyncIterable<unknown> {
    if (this.username === undefined) {
      this.readySemaphore.wait();
    }
    if (this.client) {
      for await (const message of this.client.stream(path, {})) {
        yield message.PAYL;
      }
    }
  }
}
