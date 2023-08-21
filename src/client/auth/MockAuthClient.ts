import { AuthClient } from '@luna/client/auth/AuthClient';

export class MockAuthClient implements AuthClient {
  logIn(username: string, password: string): boolean {
    return true;
  }

  logOut(): boolean {
    return true;
  }

  getPublicUsers(): string[] {
    return ['Alice', 'Bob', 'Charles'];
  }
}
