import { AuthApi } from '@luna/api/auth/AuthApi';
import { Token } from '@luna/api/auth/Token';
import { User } from '@luna/api/auth/User';

// TODO: Auto-generate these types from the Swagger definition?

interface ApiUser {
  created_at: string;
  email: string;
  id: number;
  last_login: string;
  permanent_api_token: boolean;
  registration_key?: {
    created_at: string;
    description: string;
    expires_at: string;
    id: number;
    key: string;
    permanent: boolean;
    updated_at: string;
  };
  updated_at: string;
  username: string;
}

export class LighthouseAuthApi implements AuthApi {
  private user?: User;

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
    if (!username || !password) {
      return null;
    }

    await fetch(`${this.url}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const apiUserResponse = await fetch(
      `${this.url}/users?${new URLSearchParams({
        name: username,
      })}`,
      {
        credentials: 'include',
      }
    );
    const apiUser: ApiUser = await apiUserResponse.json();
    const user: User = {
      username: apiUser.username,
    };

    return user;
  }

  async logOut(): Promise<boolean> {
    await fetch(`${this.url}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    return true;
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
