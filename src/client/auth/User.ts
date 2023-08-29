import { Role } from '@luna/client/auth/Role';

export interface User {
  username: string;
  role?: Role;
  course?: string;
  createdAt?: Date;
  lastSeen?: Date;
}
