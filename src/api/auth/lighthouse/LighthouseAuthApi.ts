import { AuthApi } from '@luna/api/auth/AuthApi';
import * as convert from '@luna/api/auth/lighthouse/convert';
import * as generated from '@luna/api/auth/lighthouse/generated';
import { Login, Signup, Token, User } from '@luna/api/auth/types';

export class LighthouseAuthApi implements AuthApi {
  private apiClient: generated.Api<unknown>;
  private apiUser?: generated.User;

  constructor(url: string = 'https://lighthouse.uni-kiel.de/api') {
    this.apiClient = new generated.Api({
      baseUrl: url,
      baseApiParams: {
        credentials: 'include',
      },
    });
  }

  async signUp(signup: Signup): Promise<User | null> {
    try {
      const apiResponse = await this.apiClient.register.registerCreate(
        convert.signupToApiRegisterPayload(signup)
      );

      const apiUser = apiResponse.data;
      this.apiUser = apiUser;
      return convert.apiUserToUser(apiUser);
    } catch {
      return null;
    }
  }

  async logIn(login?: Login): Promise<User | null> {
    try {
      const apiUserResponse = await this.apiClient.login.loginCreate(
        convert.loginToApiLoginPayload(login)
      );

      const apiUser = apiUserResponse.data;
      this.apiUser = apiUser;
      return convert.apiUserToUser(apiUser);
    } catch {
      return null;
    }
  }

  async logOut(): Promise<boolean> {
    try {
      await this.apiClient.logout.logoutCreate();

      this.apiUser = undefined;
      return true;
    } catch {
      return false;
    }
  }

  async getPublicUsers(): Promise<User[]> {
    // TODO: we currently don't have the concept of public users in the new API (heimdall)
    return this.getAllUsers();
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const apiUsersResponse = await this.apiClient.users.usersList();

      const apiUsers: generated.User[] = apiUsersResponse.data;
      return apiUsers.map(convert.apiUserToUser);
    } catch {
      return [];
    }
  }

  async getToken(): Promise<Token | null> {
    const apiUser = this.apiUser;
    if (!apiUser || !apiUser.id) {
      return null;
    }

    try {
      const apiTokenResponse = await this.apiClient.users.apiTokenDetail(
        apiUser.id
      );

      const apiToken: generated.APIToken = apiTokenResponse.data;
      return convert.apiTokenToToken(apiToken);
    } catch {
      return null;
    }
  }
}
