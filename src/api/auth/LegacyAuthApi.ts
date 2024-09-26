import { AuthApi } from '@luna/api/auth/AuthApi';
import { Login } from '@luna/api/auth/types/Login';
import { Role } from '@luna/api/auth/types/Role';
import { Signup } from '@luna/api/auth/types/Signup';
import { Token } from '@luna/api/auth/types/Token';
import { User } from '@luna/api/auth/types/User';

export class LegacyAuthApi implements AuthApi {
  private lastUser?: User;

  constructor(
    private readonly url: string = 'https://lighthouse.uni-kiel.de'
  ) {}

  async signUp(signup: Signup): Promise<User | null> {
    console.error('LegacyAuthApi: signUp not implemented');
    return null;
  }

  async logIn(login?: Login): Promise<User | null> {
    const body = new URLSearchParams();
    if (login?.username !== undefined) {
      body.append('username', login.username);
    }
    if (login?.password !== undefined) {
      body.append('password', login.password);
    }

    const response = await fetch(`${this.url}/login`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body,
    });

    if (!response.ok) {
      return null;
    }

    const responseBody = await response.text();
    const userInfo = /Hallo(?:.*>([^<]+)<\/span><\/a>)?\s*(\S+)/g.exec(
      responseBody
    );

    if (userInfo === null) {
      return null;
    }

    const parsedRole: string | undefined = userInfo[1];
    const parsedUsername = userInfo[2];
    let role: Role;

    switch (parsedRole) {
      case 'admin':
        role = Role.Admin;
        break;
      default:
        role = Role.User;
        break;
    }

    const user = {
      username: parsedUsername,
      role,
    };
    this.lastUser = user;

    return user;
  }

  async logOut(): Promise<boolean> {
    const response = await fetch(`${this.url}/logout`, {
      mode: 'cors',
      credentials: 'include',
    });
    return response.ok;
  }

  async getPublicUsers(): Promise<User[]> {
    const response = await fetch(`${this.url}/users`, {
      mode: 'cors',
      credentials: 'include',
    });

    const body = await response.text();

    const result = /var users = (\[[^\]]+\])/g.exec(body);
    if (result === null) {
      return [];
    }

    const usernames: string[] = JSON.parse(result[1]);
    return usernames.map(username => ({ username }));
  }

  async getAllUsers(): Promise<User[]> {
    // TODO
    return this.getPublicUsers();
  }

  async getToken(): Promise<Token | null> {
    // TODO: We could probably use the redirected login response already

    if (this.lastUser === undefined) {
      return null;
    }

    const response = await fetch(`${this.url}/user/${this.lastUser.username}`, {
      mode: 'cors',
      credentials: 'include',
    });

    const body = await response.text();

    const result = /"TOKEN":"(API-TOK[^"]+)"/g.exec(body);
    if (result === null) {
      return null;
    }

    const expiryResult =
      /Gültig bis:\s*(\d+)\.(\d+)\.(\d+)\s+(\d+):(\d+)/g.exec(body);
    let expiresAt: Date | undefined;
    if (expiryResult) {
      const [day, month, year, hour, minute] = expiryResult.slice(1);
      expiresAt = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
    }

    return {
      value: result[1],
      expiresAt,
    };
  }
}
