import { Role, User } from '@luna/api/auth/types';

/** Tests whether a user is an admin or a role is the admin role. */
export function isAdmin(value: User | Role): boolean {
  if ('username' in value) {
    return value.roles?.find(isAdmin) !== undefined;
  } else {
    return value.name === 'admin';
  }
}
