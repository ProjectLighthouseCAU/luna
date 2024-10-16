import { AuthApi } from '@luna/api/auth/AuthApi';
import { Login, Role, Signup, Token, User } from '@luna/api/auth/types';
import { Pagination, slicePage } from '@luna/utils/pagination';
import { errorResult, okResult, Result } from '@luna/utils/result';

export class LegacyAuthApi implements AuthApi {
  private lastUser?: User;

  constructor(
    private readonly url: string = 'https://lighthouse.uni-kiel.de'
  ) {}

  async signUp(signup: Signup): Promise<Result<User>> {
    return errorResult('Signup is not implemented for legacy API');
  }

  async logIn(login?: Login): Promise<Result<User>> {
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
      return errorResult(
        `Login failed: ${response.status} ${response.statusText}`
      );
    }

    const responseBody = await response.text();
    const userInfo = /Hallo(?:.*>([^<]+)<\/span><\/a>)?\s*(\S+)/g.exec(
      responseBody
    );

    if (userInfo === null) {
      return errorResult('Could not parse logged in user from page');
    }

    const parsedRole: string | undefined = userInfo[1];
    const parsedUsername = userInfo[2];
    let role: Role;

    switch (parsedRole) {
      case 'admin':
        role = {
          id: 0,
          name: 'admin',
        };
        break;
      default:
        role = {
          id: 0,
          name: 'user',
        };
        break;
    }

    const user = {
      username: parsedUsername,
      role,
    };
    this.lastUser = user;

    return okResult(user);
  }

  async logOut(): Promise<Result<void>> {
    const response = await fetch(`${this.url}/logout`, {
      mode: 'cors',
      credentials: 'include',
    });

    if (response.ok) {
      return okResult(undefined);
    } else {
      return errorResult(
        `Logout failed: ${response.status} ${response.statusText}`
      );
    }
  }

  async getPublicUsers(pagination?: Pagination): Promise<Result<User[]>> {
    const response = await fetch(`${this.url}/users`, {
      mode: 'cors',
      credentials: 'include',
    });

    const body = await response.text();

    const result = /var users = (\[[^\]]+\])/g.exec(body);
    if (result === null) {
      return errorResult('Could not parse users from page');
    }

    let usernames: string[] = JSON.parse(result[1]);

    // Emulate pagination since the legacy website doesn't support it
    usernames = slicePage(usernames, pagination);

    return okResult(usernames.map(username => ({ username })));
  }

  async getAllUsers(pagination?: Pagination): Promise<Result<User[]>> {
    // TODO
    return this.getPublicUsers(pagination);
  }

  async getToken(): Promise<Result<Token>> {
    // TODO: We could probably use the redirected login response already

    if (this.lastUser === undefined) {
      return errorResult('Cannot fetch token without a user');
    }

    const response = await fetch(`${this.url}/user/${this.lastUser.username}`, {
      mode: 'cors',
      credentials: 'include',
    });

    const body = await response.text();

    const result = /"TOKEN":"(API-TOK[^"]+)"/g.exec(body);
    if (result === null) {
      return errorResult('Could not parse API token from page');
    }

    const expiryResult =
      /Gültig bis:\s*(\d+)\.(\d+)\.(\d+)\s+(\d+):(\d+)/g.exec(body);
    let expiresAt: Date | undefined;
    if (expiryResult) {
      const [day, month, year, hour, minute] = expiryResult.slice(1);
      expiresAt = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
    }

    return okResult({
      value: result[1],
      expiresAt,
    });
  }
}
