import { AuthApi } from '@luna/api/auth/AuthApi';
import { Token } from '@luna/api/auth/Token';
import { User } from '@luna/api/auth/User';

export class LighthouseAuthApi implements AuthApi {
  constructor(
    private readonly url: string = 'https://lighthouse.uni-kiel.de/api'
  ) {}

  async signUp(
    registrationKey: string,
    username?: string,
    password?: string
  ): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  async logIn(username?: string, password?: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  async logOut(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async getPublicUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async getAllUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async getToken(): Promise<Token | null> {
    throw new Error('Method not implemented.');
  }
}
