export interface RegistrationKey {
  id: number;
  key: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt?: Date;
  permanent?: boolean;
}
