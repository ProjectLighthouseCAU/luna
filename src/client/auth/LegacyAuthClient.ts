import { AuthClient } from '@luna/client/auth/AuthClient';
import { Token } from '@luna/client/auth/Token';

// FIXME: Implement this client

export class LegacyAuthClient implements AuthClient {
  // TODO: Make this customizable
  private username?: string;

  constructor(
    private readonly url: string = 'https://lighthouse.uni-kiel.de'
  ) {}

  async logIn(username: string, password: string): Promise<boolean> {
    this.username = username;

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

    return response.ok && response.redirected;
  }

  async logOut(): Promise<boolean> {
    this.username = undefined;
    return true;
  }

  async getPublicUsers(): Promise<string[]> {
    // TODO: Fetch all public users
    return this.username !== undefined ? [this.username] : [];
  }

  async getToken(): Promise<Token | null> {
    if (this.username === undefined) {
      return null;
    }

    // TODO: We could probably use the redirected login response already

    const response = await fetch(`${this.url}/user/${this.username}`, {
      mode: 'cors',
      credentials: 'include',
    });

    const body = await response.text();
    const result = /"TOKEN":"(API-TOK[^"]+)"/g.exec(body);

    // TODO: Parse expiry

    if (result === null) {
      return null;
    }

    return {
      token: result[1],
    };
  }
}
