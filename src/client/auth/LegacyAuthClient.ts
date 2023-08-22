import { AuthClient } from '@luna/client/auth/AuthClient';
import { Token } from '@luna/client/auth/Token';

// FIXME: Implement this client

export class LegacyAuthClient implements AuthClient {
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
