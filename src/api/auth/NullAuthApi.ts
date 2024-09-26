import { AuthApi } from '@luna/api/auth/AuthApi';
import { Login } from '@luna/api/auth/types/Login';
import { Signup } from '@luna/api/auth/types/Signup';
import { Token } from '@luna/api/auth/types/Token';
import { User } from '@luna/api/auth/types/User';

export class NullAuthApi implements AuthApi {
  async signUp(signup: Signup): Promise<User | null> {
    return null;
  }

  async logIn(login?: Login): Promise<User | null> {
    return null;
  }

  async logOut(): Promise<boolean> {
    return false;
  }

  async getPublicUsers(): Promise<User[]> {
    return [];
  }

  async getAllUsers(): Promise<User[]> {
    return [];
  }

  async getToken(): Promise<Token | null> {
    return null;
  }
}
