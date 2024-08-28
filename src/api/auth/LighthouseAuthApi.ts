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
  registration_key?: {
    created_at: string;
    description: string;
    expires_at: string;
    id: number;
    key: string;
    permanent: boolean;
    updated_at: string;
  };
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  private user?: ApiUser;

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
    const user: User = {
      username: apiUser.username,
      role: undefined, // TODO: change role to roles
      course: apiUser.registration_key?.key,
      createdAt: new Date(apiUser.created_at),
      lastSeen: new Date(apiUser.last_login),
    };
    return user;
  }

  async logIn(username?: string, password?: string): Promise<User | null> {
    if (!username || !password) {
      return null;
    }

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

    const apiUser: ApiUser = await apiUserResponse.json();
    this.user = apiUser;

    const user: User = {
      username: apiUser.username,
      role: undefined, // TODO: change role to roles
      course: apiUser.registration_key?.key,
      createdAt: new Date(apiUser.created_at),
      lastSeen: new Date(apiUser.last_login),
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
    // TODO: we currently don't have the concept of public users in the new API (heimdall)
    return this.getAllUsers();
  }

  async getAllUsers(): Promise<User[]> {
    const apiUsersResponse = await fetch(`${this.url}/users`, {
      credentials: 'include',
    });
    const apiUsers: ApiUser[] = await apiUsersResponse.json();
    const users: User[] = apiUsers.map(apiUser => {
      const user: User = {
        username: apiUser.username,
        role: undefined, // TODO: change role to roles
        course: apiUser.registration_key?.key,
        createdAt: new Date(apiUser.created_at),
        lastSeen: new Date(apiUser.last_login),
      };
      return user;
    });
    return users;
  }

  async getToken(): Promise<Token | null> {
    if (!this.user) {
      return null;
    }
    const apiTokenResponse = await fetch(
      `${this.url}/users/${this.user.id}/api-token`,
      {
        credentials: 'include',
      }
    );
    const apiToken: ApiToken = await apiTokenResponse.json();
    const token: Token = {
      value: apiToken.api_token,
      expiresAt: new Date(apiToken.expires_at),
    };
    return token;
  }
}
