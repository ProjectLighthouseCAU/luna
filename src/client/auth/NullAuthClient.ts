import { AuthClient } from '@luna/client/auth/AuthClient';

export class NullAuthClient implements AuthClient {
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
