import { AuthApi } from '@luna/api/auth/AuthApi';
import { Login, Signup, Token, User } from '@luna/api/auth/types';

export class MockAuthApi implements AuthApi {
  async signUp(signup: Signup): Promise<User | null> {
    return null;
  }

  async logIn(login?: Login): Promise<User | null> {
    return {
      username: login?.username ?? 'Alice',
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
