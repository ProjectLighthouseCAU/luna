import { AuthClient } from '@luna/client/auth/AuthClient';
import { Token } from '@luna/client/auth/Token';

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

  async getToken(): Promise<Token> {
    return {
      token: 'API-TOK-Mock',
      expiresAt: new Date(new Date().getTime() + 30 * 86_400_000),
    };
  }
}
