import { AuthApi } from '@luna/api/auth/AuthApi';
import * as convert from '@luna/api/auth/lighthouse/convert';
import * as generated from '@luna/api/auth/lighthouse/generated';
import { Login, Signup, Token, User } from '@luna/api/auth/types';
import { errorResult, okResult, Result } from '@luna/utils/result';

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

  async signUp(signup: Signup): Promise<Result<User>> {
    try {
      const apiResponse = await this.apiClient.register.registerCreate(
        convert.signupToApiRegisterPayload(signup)
      );
      const apiUser = apiResponse.data;
      this.apiUser = apiUser;
      return okResult(convert.apiUserToUser(apiUser));
    } catch (error) {
      return errorResult(`Signup failed: ${formatError(error)}`);
    }
  }

  async logIn(login?: Login): Promise<Result<User>> {
    try {
      const apiUserResponse = await this.apiClient.login.loginCreate(
        convert.loginToApiLoginPayload(login)
      );
      const apiUser = apiUserResponse.data;
      this.apiUser = apiUser;
      return okResult(convert.apiUserToUser(apiUser));
    } catch (error) {
      return errorResult(`Login failed: ${formatError(error)}`);
    }
  }

  async logOut(): Promise<Result<void>> {
    try {
      await this.apiClient.logout.logoutCreate();
      this.apiUser = undefined;
      return okResult(undefined);
    } catch (error) {
      return errorResult(`Logout failed: ${formatError(error)}`);
    }
  }

  async getPublicUsers(): Promise<Result<User[]>> {
    // TODO: we currently don't have the concept of public users in the new API (heimdall)
    return this.getAllUsers();
  }

  async getAllUsers(): Promise<Result<User[]>> {
    try {
      const apiUsersResponse = await this.apiClient.users.usersList();
      const apiUsers: generated.User[] = apiUsersResponse.data;
      return okResult(apiUsers.map(convert.apiUserToUser));
    } catch (error) {
      return errorResult(`Fetching all users failed: ${formatError(error)}`);
    }
  }

  async getToken(): Promise<Result<Token>> {
    const apiUser = this.apiUser;

    if (!apiUser || !apiUser.id) {
      return errorResult('Cannot fetch token without a user');
    }

    try {
      const apiTokenResponse = await this.apiClient.users.apiTokenDetail(
        apiUser.id
      );
      const apiToken: generated.APIToken = apiTokenResponse.data;
      return okResult(convert.apiTokenToToken(apiToken));
    } catch (error) {
      return errorResult(`Fetching token failed: ${formatError(error)}`);
    }
  }
}

function formatError(error: any): string {
  if (error instanceof Response) {
    return `${error.status} ${error.statusText}`;
  } else {
    return `${error}`;
  }
}
