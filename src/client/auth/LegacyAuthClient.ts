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

    if (response.status !== 303) {
      console.warn(
        `Legacy backend responded with ${response.status} to login request`
      );
      return false;
    }

    return true;
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
    return null;
  }
}
