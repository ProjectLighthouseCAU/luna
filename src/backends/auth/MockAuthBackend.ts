import { AuthBackend } from '@luna/backends/auth/AuthBackend';
import { Token } from '@luna/backends/auth/Token';
import { User } from '@luna/backends/auth/User';

export class MockAuthBackend implements AuthBackend {
  async signUp(
    registrationKey: string,
    username: string,
    password: string
  ): Promise<User | null> {
    return null;
  }

  async logIn(username?: string, password?: string): Promise<User | null> {
    return {
      username: 'Alice',
    };
  }

  async logOut(): Promise<boolean> {
    return true;
  }

  async getPublicUsers(): Promise<User[]> {
    return ['Alice', 'Bob', 'Charles'].map(username => ({ username }));
  }

  async getAllUsers(): Promise<User[]> {
    return await this.getPublicUsers();
  }

  async getToken(): Promise<Token> {
    return {
      value: 'API-TOK-Mock',
      expiresAt: new Date(new Date().getTime() + 30 * 86_400_000),
    };
  }
}
