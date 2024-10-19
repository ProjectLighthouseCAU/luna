import * as generated from '@luna/contexts/api/auth/generated';
import {
  Login,
  Signup,
  Token,
  User,
  RegistrationKey,
} from '@luna/contexts/api/auth/types';
import { CreateOrUpdateUserPayload } from '@luna/contexts/api/auth/types/CreateOrUpdateUserPayload';

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
    expiresAt: new Date(apiToken.expires_at!),
    username: apiToken.username!,
    roles: apiToken.roles!,
  };
}

export function userFromApi(apiUser: generated.User): User {
  return {
    id: apiUser.id!,
    username: apiUser.username!,
    email: apiUser.email!,
    roles: [], // TODO: re-run code generator and use roles
    createdAt: new Date(apiUser.created_at!),
    updatedAt: new Date(apiUser.updated_at!),
    lastSeen: new Date(apiUser.last_login!),
    permanentApiToken: apiUser.permanent_api_token!,
    registrationKey: apiUser.registration_key
      ? registrationKeyFromApi(apiUser.registration_key)
      : undefined,
  };
}

export function registrationKeyFromApi(
  registrationKey: generated.RegistrationKey
): RegistrationKey {
  return {
    id: registrationKey.id!,
    key: registrationKey.key!,
    description: registrationKey.description!,
    createdAt: new Date(registrationKey.created_at!),
    updatedAt: new Date(registrationKey.updated_at!),
    expiresAt: new Date(registrationKey.expires_at!),
    permanent: registrationKey.permanent!,
  };
}

export function createOrUpdateUserPayloadToApi(
  payload: CreateOrUpdateUserPayload
): generated.CreateOrUpdateUserPayload {
  return {
    username: payload.username,
    password: payload.password,
    email: payload.email,
    permanent_api_token: payload.permanent_api_token,
  };
}
