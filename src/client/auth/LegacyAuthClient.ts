import { AuthClient } from '@luna/client/auth/AuthClient';
import { Role } from '@luna/client/auth/Role';
import { Token } from '@luna/client/auth/Token';
import { User } from '@luna/client/auth/User';

export class LegacyAuthClient implements AuthClient {
  private user: User | null = null;

  constructor(
    private readonly url: string = 'https://lighthouse.uni-kiel.de'
  ) {}

  async logIn(username: string, password: string): Promise<boolean> {
    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);

    const response = await fetch(`${this.url}/login`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body,
    });

    // TODO: The backend sends an `HttpOnly` cookie which
    // we can't really control from client-side JS. This means
    // once the user has authenticated successfully once
    // any login response seems to go through, even if e.g.
    // username and password are empty. In that case, the cookie
    // has to be deleted manually through the browser dev tools.

    if (!response.ok || !response.redirected) {
      return false;
    }

    const responseBody = await response.text();
    const userInfo = /Hallo(?:.*>([^<]+)<\/span><\/a>)?\s*(\S+)/g.exec(
      responseBody
    );

    if (userInfo === null) {
      return false;
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

    this.user = {
      username: parsedUsername,
      role,
    };

    return true;
  }

  async logOut(): Promise<boolean> {
    this.user = null;
    return true;
  }

  async getPublicUsers(): Promise<User[]> {
    if (!this.user) {
      return [];
    }

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

  async getUser(): Promise<User | null> {
    return this.user;
  }

  async getToken(): Promise<Token | null> {
    if (!this.user) {
      return null;
    }

    // TODO: We could probably use the redirected login response already

    const response = await fetch(`${this.url}/user/${this.user}`, {
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
