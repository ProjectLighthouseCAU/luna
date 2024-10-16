import { AuthApi } from '@luna/api/auth/AuthApi';
import { Login, Signup, Token, User } from '@luna/api/auth/types';
import { Pagination } from '@luna/utils/pagination';
import { errorResult, Result } from '@luna/utils/result';

export class NullAuthApi implements AuthApi {
  async signUp(signup: Signup): Promise<Result<User>> {
    return errorResult('Null auth API does not support signup');
  }

  async logIn(login?: Login): Promise<Result<User>> {
    return errorResult('Null auth API does not support login');
  }

  async logOut(): Promise<Result<void>> {
    return errorResult('Null auth API does not support logout');
  }

  async getPublicUsers(pagination?: Pagination): Promise<Result<User[]>> {
    return errorResult('Null auth API does not support fetching public users');
  }

  async getAllUsers(pagination?: Pagination): Promise<Result<User[]>> {
    return errorResult('Null auth API does not support fetching all users');
  }

  async getToken(): Promise<Result<Token>> {
    return errorResult('Null auth API does not support fetching token');
  }
}
