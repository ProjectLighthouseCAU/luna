import * as generated from '@luna/api/auth/lighthouse/generated';
import {
  Login,
  Signup,
  Token,
  User,
  RegistrationKey,
} from '@luna/api/auth/types';

export function loginToApi(login?: Login): generated.LoginPayload {
  return {
    username: login?.username,
    password: login?.password,
  };
}

export function signupToApi(signup: Signup): generated.RegisterPayload {
  return {
    registration_key: signup.registrationKey,
    email: signup.email,
    username: signup.username,
    password: signup.password,
  };
}

export function tokenFromApi(apiToken: generated.APIToken): Token {
  return {
    value: apiToken.api_token!,
    expiresAt: apiToken.expires_at ? new Date(apiToken.expires_at) : undefined,
  };
}

export function userFromApi(apiUser: generated.User): User {
  return {
    id: apiUser.id,
    username: apiUser.username!,
    email: apiUser.email,
    roles: undefined, // TODO: change role to roles
    createdAt: apiUser.created_at ? new Date(apiUser.created_at) : undefined,
    updatedAt: apiUser.updated_at ? new Date(apiUser.updated_at) : undefined,
    lastSeen: apiUser.last_login ? new Date(apiUser.last_login) : undefined,
    permanentApiToken: apiUser.permanent_api_token,
    registrationKey: apiUser.registration_key
      ? registrationKeyFromApi(apiUser.registration_key)
      : undefined,
  };
}

export function registrationKeyFromApi(
  registrationKey: generated.RegistrationKey
): RegistrationKey {
  return {
    id: registrationKey.id ?? 0,
    key: registrationKey.key ?? '',
    description: registrationKey.description,
    createdAt: registrationKey.created_at
      ? new Date(registrationKey.created_at)
      : undefined,
    updatedAt: registrationKey.updated_at
      ? new Date(registrationKey.updated_at)
      : undefined,
    expiresAt: registrationKey.expires_at
      ? new Date(registrationKey.expires_at)
      : undefined,
    permanent: registrationKey.permanent,
  };
}
