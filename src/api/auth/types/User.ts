import { Role } from '@luna/api/auth/types';
import { RegistrationKey } from '@luna/api/auth/types/RegistrationKey';

export interface User {
  id?: number;
  username: string;
  email?: string;
  roles?: Role[];
  createdAt?: Date;
  updatedAt?: Date;
  lastSeen?: Date;
  permanentApiToken?: boolean;
  registrationKey?: RegistrationKey;
}
