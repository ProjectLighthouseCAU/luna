import { AuthClient } from '@luna/client/auth/AuthClient';
import { Token } from '@luna/client/auth/Token';

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

  async getToken(): Promise<Token | null> {
    return null;
  }
}
