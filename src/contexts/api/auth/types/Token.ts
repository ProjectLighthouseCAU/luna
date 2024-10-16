import { Role } from '@luna/contexts/api/auth/types/Role';

export interface Token {
  value: string;
  expiresAt?: Date;
  username?: string;
  roles?: Role[];
}
