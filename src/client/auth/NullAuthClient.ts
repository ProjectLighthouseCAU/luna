import { AuthClient } from '@luna/client/auth/AuthClient';

export class NullAuthClient implements AuthClient {
  async logIn(username: string, password: string): Promise<boolean> {
    return false;
  }

  async logOut(): Promise<boolean> {
    return false;
  }

  async getPublicUsers(): Promise<string[]> {
    return [];
  }
}
