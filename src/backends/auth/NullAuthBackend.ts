import { AuthBackend } from '@luna/backends/auth/AuthBackend';
import { Token } from '@luna/backends/auth/Token';
import { User } from '@luna/backends/auth/User';

export class NullAuthBackend implements AuthBackend {
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
