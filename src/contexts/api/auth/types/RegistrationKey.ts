export interface RegistrationKey {
  id: number;
  key: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  permanent: boolean;
}

export function newUninitializedRegistrationKey(): RegistrationKey {
  return {
    id: 0,
    key: '',
    description: '',
    createdAt: new Date(0),
    updatedAt: new Date(0),
    expiresAt: new Date(0),
    permanent: false,
  };
}
