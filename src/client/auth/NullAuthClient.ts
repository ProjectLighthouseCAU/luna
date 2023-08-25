import { AuthClient } from '@luna/client/auth/AuthClient';
import { Token } from '@luna/client/auth/Token';
import { User } from '@luna/client/auth/User';

export class NullAuthClient implements AuthClient {
  async logIn(username: string, password: string): Promise<boolean> {
    return false;
  }

  async logOut(): Promise<boolean> {
    return false;
  }

  async getPublicUsers(): Promise<User[]> {
    return [];
  }

  async getUser(): Promise<User | null> {
    return null;
  }

  async getToken(): Promise<Token | null> {
    return null;
  }
}
