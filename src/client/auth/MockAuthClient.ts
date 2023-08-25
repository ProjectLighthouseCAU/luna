import { AuthClient } from '@luna/client/auth/AuthClient';
import { Token } from '@luna/client/auth/Token';
import { User } from '@luna/client/auth/User';

export class MockAuthClient implements AuthClient {
  async logIn(username: string, password: string): Promise<boolean> {
    return true;
  }

  async logOut(): Promise<boolean> {
    return true;
  }

  async getPublicUsers(): Promise<User[]> {
    return ['Alice', 'Bob', 'Charles'].map(username => ({ username }));
  }

  async getUser(): Promise<User | null> {
    return {
      username: 'Alice',
    };
  }

  async getToken(): Promise<Token> {
    return {
      value: 'API-TOK-Mock',
      expiresAt: new Date(new Date().getTime() + 30 * 86_400_000),
    };
  }
}
