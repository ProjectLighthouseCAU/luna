import * as generated from '@luna/contexts/api/auth/generated';
import {
  Login,
  Signup,
  Token,
  User,
  RegistrationKey,
  Role,
} from '@luna/contexts/api/auth/types';
import { CreateOrUpdateRegistrationKeyPayload } from '@luna/contexts/api/auth/types/CreateOrUpdateRegistrationKeyPayload';
import { CreateOrUpdateRolePayload } from '@luna/contexts/api/auth/types/CreateOrUpdateRolePayload';
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
    roles: apiUser.roles?.map(apiRole => roleFromApi(apiRole)) ?? [], // TODO: re-run code generator and use roles
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

export function roleFromApi(role: generated.Role): Role {
  return {
    id: role.id!,
    name: role.name!,
    createdAt: new Date(role.created_at!),
    updatedAt: new Date(role.updated_at!),
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

export function createOrUpdateRolePayloadToApi(
  payload: CreateOrUpdateRolePayload
): generated.CreateOrUpdateRolePayload {
  return {
    name: payload.name,
  };
}

export function createOrUpdateRegistrationKeyPayloadToApi(
  payload: CreateOrUpdateRegistrationKeyPayload
): generated.CreateRegistrationKeyPayload {
  return {
    key: payload.key,
    description: payload.description,
    expires_at: payload.expires_at.toISOString(),
    permanent: payload.permanent,
  };
}
