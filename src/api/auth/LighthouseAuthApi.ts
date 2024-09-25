import { AuthApi } from '@luna/api/auth/AuthApi';
import { Token } from '@luna/api/auth/Token';
import { User } from '@luna/api/auth/User';

// TODO: Auto-generate these types from the Swagger definition?

interface ApiUser {
  id: number;
  created_at: string;
  updated_at: string;
  last_login: string;
  username: string;
  email: string;
  permanent_api_token: boolean;
  registration_key?: ApiRegistrationKey;
}

interface ApiToken {
  api_token: string;
  expires_at: string;
  roles: string[];
  username: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ApiRole {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
}

interface ApiRegistrationKey {
  id: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
  key: string;
  description: string;
  permanent: boolean;
}

export class LighthouseAuthApi implements AuthApi {
  private apiUser?: ApiUser;

  constructor(
    private readonly url: string = 'https://lighthouse.uni-kiel.de/api'
  ) {}

  async signUp(
    registrationKey: string,
    username?: string,
    password?: string
  ): Promise<User | null> {
    const apiSignUpResponse = await fetch(`${this.url}/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        registration_key: registrationKey,
        email: 'todo@example.com', // TODO: add email to parameters
      }),
    });
    const apiUser: ApiUser = await apiSignUpResponse.json();
    const user: User = apiUserToUser(apiUser);
    return user;
  }

  async logIn(username?: string, password?: string): Promise<User | null> {
    const apiUserResponse = await fetch(`${this.url}/login`, {
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

function apiUserToUser(apiUser: ApiUser): User {
  return {
    username: apiUser.username,
    role: undefined, // TODO: change role to roles
    course: apiUser.registration_key?.key,
    createdAt: new Date(apiUser.created_at),
    lastSeen: new Date(apiUser.last_login),
  };
}

function apiTokenToToken(apiToken: ApiToken): Token {
  return {
    value: apiToken.api_token,
    expiresAt: new Date(apiToken.expires_at),
  };
}
