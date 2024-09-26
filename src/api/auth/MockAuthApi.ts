import { AuthApi } from '@luna/api/auth/AuthApi';
import { Login, Signup, Token, User } from '@luna/api/auth/types';
import { errorResult, okResult, Result } from '@luna/utils/result';

export class MockAuthApi implements AuthApi {
  async signUp(signup: Signup): Promise<Result<User>> {
    return errorResult('Signup is not implemented for mock API');
  }

  async logIn(login?: Login): Promise<Result<User>> {
    return okResult({
      username: login?.username ?? 'Alice',
    });
  }

  async logOut(): Promise<Result<void>> {
    return okResult(undefined);
  }

  async getPublicUsers(): Promise<Result<User[]>> {
    return okResult(
      ['Alice', 'Bob', 'Charles'].map(username => ({ username }))
    );
  }

  async getAllUsers(): Promise<Result<User[]>> {
    return await this.getPublicUsers();
  }

  async getToken(): Promise<Result<Token>> {
    return okResult({
      value: 'API-TOK-Mock',
      expiresAt: new Date(new Date().getTime() + 30 * 86_400_000),
    });
  }
}
