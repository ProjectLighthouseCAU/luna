export interface CreateOrUpdateUserPayload {
  username: string;
  password: string;
  email: string;
  permanent_api_token: boolean;
}
