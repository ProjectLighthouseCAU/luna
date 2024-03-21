import { AuthService } from '@luna/services/auth/AuthService';
import { Token } from '@luna/services/auth/Token';
import { User } from '@luna/services/auth/User';

export class NullAuthService implements AuthService {
  async signUp(
    registrationKey: string,
    username: string,
    password: string
  ): Promise<User | null> {
    return null;
  }

  async logIn(username?: string, password?: string): Promise<User | null> {
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
