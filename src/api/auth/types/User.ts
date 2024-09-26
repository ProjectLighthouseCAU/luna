import { Role } from '@luna/api/auth/types/Role';

export interface User {
  username: string;
  role?: Role;
  course?: string;
  createdAt?: Date;
  lastSeen?: Date;
}
