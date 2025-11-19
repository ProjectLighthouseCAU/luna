import { Role } from '@luna/contexts/api/auth/types';
import { RegistrationKey } from '@luna/contexts/api/auth/types/RegistrationKey';

export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
  lastSeen: Date;
  registrationKey?: RegistrationKey;
}

export function newUninitializedUser(): User {
  return {
    id: 0,
    username: '',
    email: '',
    roles: [],
    createdAt: new Date(0),
    updatedAt: new Date(0),
    lastSeen: new Date(0),
    registrationKey: {
      id: 0,
      key: '',
      description: '',
      createdAt: new Date(0),
      updatedAt: new Date(0),
      expiresAt: new Date(0),
      permanent: false,
    },
  };
}
