import { ModelBackend } from '@luna/backends/model/ModelBackend';

export class NullModelBackend implements ModelBackend {
  async logIn(username: string, token: string): Promise<boolean> {
    return false;
  }

  async *stream(path: string[]): AsyncIterable<undefined> {}
}
