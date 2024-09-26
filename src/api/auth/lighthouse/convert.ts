import * as generated from '@luna/api/auth/lighthouse/generated';
import { Login, Signup, Token, User } from '@luna/api/auth/types';

export function loginToApiLoginPayload(login?: Login): generated.LoginPayload {
  return {
    username: login?.username,
    password: login?.password,
  };
}

export function signupToApiRegisterPayload(
  signup: Signup
): generated.RegisterPayload {
  return {
    registration_key: signup.registrationKey,
    email: signup.email,
    username: signup.username,
    password: signup.password,
  };
}

export function apiTokenToToken(apiToken: generated.APIToken): Token {
  return {
    value: apiToken.api_token!,
    expiresAt: apiToken.expires_at ? new Date(apiToken.expires_at) : undefined,
  };
}

export function apiUserToUser(apiUser: generated.User): User {
  return {
    username: apiUser.username!,
    role: undefined, // TODO: change role to roles
    course: apiUser.registration_key?.key,
    createdAt: apiUser.created_at ? new Date(apiUser.created_at) : undefined,
    lastSeen: apiUser.last_login ? new Date(apiUser.last_login) : undefined,
  };
}
