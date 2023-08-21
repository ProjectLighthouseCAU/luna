import { AuthClient } from '@luna/client/auth/AuthClient';

export class NullAuthClient implements AuthClient {
  logIn(username: string, password: string): boolean {
    return false;
  }

  logOut(): boolean {
    return false;
  }

  getPublicUsers(): string[] {
    return [];
  }
}
