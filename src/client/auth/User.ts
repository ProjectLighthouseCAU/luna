import { Role } from '@luna/client/auth/Role';

export interface User {
  username: string;
  role?: Role;
}
