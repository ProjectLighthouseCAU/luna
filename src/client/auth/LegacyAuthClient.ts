import { AuthClient } from '@luna/client/auth/AuthClient';

export class LegacyAuthClient implements AuthClient {
  logIn(username: string, password: string): void {
    // Do nothing
  }

  logOut(): void {
    // Do nothing
  }

  getPublicUsers(): string[] {
    return [];
  }
}
