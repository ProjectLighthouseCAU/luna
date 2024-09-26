import { ApiRegistrationKey } from '@luna/api/auth/lighthouse/types';
import { User } from '@luna/api/auth/types';

export interface ApiUser {
  id: number;
  created_at: string;
  updated_at: string;
  last_login: string;
  username: string;
  email: string;
  permanent_api_token: boolean;
  registration_key?: ApiRegistrationKey;
}

export function apiUserToUser(apiUser: ApiUser): User {
  return {
    username: apiUser.username,
    role: undefined, // TODO: change role to roles
    course: apiUser.registration_key?.key,
    createdAt: new Date(apiUser.created_at),
    lastSeen: new Date(apiUser.last_login),
  };
}
