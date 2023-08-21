import { AuthClient } from '@luna/client/auth/AuthClient';

export class LegacyAuthClient implements AuthClient {
  login(username: string, password: string): void {
    // Do nothing
  }

  getPublicUsers(): string[] {
    return [];
  }
}
