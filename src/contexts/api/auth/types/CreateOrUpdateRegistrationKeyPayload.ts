export interface CreateOrUpdateRegistrationKeyPayload {
  key: string;
  description: string;
  expires_at: Date;
  permanent: boolean;
}
