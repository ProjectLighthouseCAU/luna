export interface ApiRegistrationKey {
  id: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
  key: string;
  description: string;
  permanent: boolean;
}
