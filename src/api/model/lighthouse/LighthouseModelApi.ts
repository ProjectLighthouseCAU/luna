import { ModelApi } from '@luna/api/model/ModelApi';
import { UserModel } from '@luna/contexts/api/model/types';
import { Lock } from '@luna/utils/semaphore';
import {
  ConsoleLogHandler,
  LeveledLogHandler,
  Lighthouse,
  LogLevel,
  connect,
} from 'nighthouse/browser';

export class LighthouseModelApi implements ModelApi {
  private client?: Lighthouse;
  private clientLock = new Lock();

  constructor(
    private readonly url: string = 'wss://lighthouse.uni-kiel.de/websocket'
  ) {}

  async logIn(username: string, token: string): Promise<boolean> {
    return await this.clientLock.use(async () => {
      if (this.client !== undefined) {
        await this.client.close();
      }

      this.client = connect({
        url: this.url,
        auth: { USER: username, TOKEN: token },
        logHandler: new LeveledLogHandler(
          LogLevel.Debug,
          new ConsoleLogHandler('Nighthouse: ')
        ),
      });
      await this.client.ready();

      return true;
    });
  }

  async *streamModel(user: string): AsyncIterable<UserModel> {
    if (this.client) {
      // NOTE: We only need to lock the client the initial streaming to avoid
      // any races while the connection is initializing. Any uses after the
      // client has been closed will already result in an error being thrown.

      const stream = await this.clientLock.use(
        async () => await this.client!.streamModel(user)
      );

      for await (const message of stream) {
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
      const stream = await this.clientLock.use(
        async () => await this.client!.stream(path)
      );

      for await (const message of stream) {
        yield message.PAYL;
      }
    }
  }
}
