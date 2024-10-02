import { Role } from '@luna/api/auth/types/Role';

export interface Token {
  value: string;
  expiresAt?: Date;
  username?: string;
  roles?: Role[];
}
