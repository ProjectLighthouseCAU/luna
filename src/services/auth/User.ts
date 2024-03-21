import { Role } from '@luna/services/auth/Role';

export interface User {
  username: string;
  role?: Role;
  course?: string;
  createdAt?: Date;
  lastSeen?: Date;
}
