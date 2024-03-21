import { Role } from '@luna/backends/auth/Role';

export interface User {
  username: string;
  role?: Role;
  course?: string;
  createdAt?: Date;
  lastSeen?: Date;
}
