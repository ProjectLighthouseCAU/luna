import { Login, Signup, Token, User } from '@luna/api/auth/types';
import { Pagination } from '@luna/utils/pagination';
import { Result } from '@luna/utils/result';

export interface SignupAction {
  type: 'signup';
  signup: Signup;
}

export interface LoginAction {
  type: 'login';
  login: Login;
}

export interface LogoutAction {
  type: 'logout';
}

export interface GetPublicUsersAction {
  type: 'getPublicUsers';
  pagination?: Pagination;
}

export interface GetAllUsersAction {
  type: 'getAllUsers';
  pagination?: Pagination;
}

export interface GetTokenAction {
  type: 'getToken';
}

export type AuthAction =
  | SignupAction
  | LoginAction
  | LogoutAction
  | GetPublicUsersAction
  | GetAllUsersAction;

export type AuthResult<T> = Promise<
  Result<
    T extends SignupAction
      ? User
      : T extends LoginAction
        ? User
        : T extends GetPublicUsersAction
          ? User[]
          : T extends GetAllUsersAction
            ? User[]
            : T extends GetTokenAction
              ? Token
              : void
  >
>;
