import { AuthClient } from '@luna/client/auth/AuthClient';

export class MockAuthClient implements AuthClient {
  async logIn(username: string, password: string): Promise<boolean> {
    return true;
  }

  async logOut(): Promise<boolean> {
    return true;
  }

  async getPublicUsers(): Promise<string[]> {
    return ['Alice', 'Bob', 'Charles'];
  }
}
