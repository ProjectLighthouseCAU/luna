import { AuthApi } from '@luna/api/auth/AuthApi';
import {
  ApiToken,
  apiTokenToToken,
  ApiUser,
  apiUserToUser,
} from '@luna/api/auth/lighthouse/types';
import { Login, Signup, Token, User } from '@luna/api/auth/types';

// TODO: Auto-generate these types from the Swagger definition?

export class LighthouseAuthApi implements AuthApi {
  private apiUser?: ApiUser;

  constructor(
    private readonly url: string = 'https://lighthouse.uni-kiel.de/api'
  ) {}

  async signUp(signup: Signup): Promise<User | null> {
    const apiSignUpResponse = await fetch(`${this.url}/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: signup.username,
        password: signup.password,
        registration_key: signup.registrationKey,
        email: signup.email,
      }),
    });
    const apiUser: ApiUser = await apiSignUpResponse.json();
    const user: User = apiUserToUser(apiUser);
    return user;
  }

  async logIn(login?: Login): Promise<User | null> {
    const apiUserResponse = await fetch(`${this.url}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: login?.username,
        password: login?.password,
      }),
    });

    if (!apiUserResponse.ok) {
      return null;
    }

    const apiUser: ApiUser = await apiUserResponse.json();
    const user: User = apiUserToUser(apiUser);

    this.apiUser = apiUser;

    return user;
  }

  async logOut(): Promise<boolean> {
    const apiResponse = await fetch(`${this.url}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!apiResponse.ok) {
      return false;
    }
    this.apiUser = undefined;
    return true;
  }

  async getPublicUsers(): Promise<User[]> {
    // TODO: we currently don't have the concept of public users in the new API (heimdall)
    return this.getAllUsers();
  }

  async getAllUsers(): Promise<User[]> {
    const apiUsersResponse = await fetch(`${this.url}/users`, {
      credentials: 'include',
    });

    if (!apiUsersResponse.ok) {
      return [];
    }

    const apiUsers: ApiUser[] = await apiUsersResponse.json();
    const users: User[] = apiUsers.map(apiUserToUser);

    return users;
  }

  async getToken(): Promise<Token | null> {
    if (!this.apiUser) {
      return null;
    }

    const apiTokenResponse = await fetch(
      `${this.url}/users/${this.apiUser.id}/api-token`,
      {
        credentials: 'include',
      }
    );

    if (!apiTokenResponse.ok) {
      return null;
    }

    const apiToken: ApiToken = await apiTokenResponse.json();
    const token: Token = apiTokenToToken(apiToken);

    return token;
  }
}
