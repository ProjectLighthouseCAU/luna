import { Token } from '@luna/api/auth/types';

export interface ApiToken {
  api_token: string;
  expires_at: string;
  roles: string[];
  username: string;
}

export function apiTokenToToken(apiToken: ApiToken): Token {
  return {
    value: apiToken.api_token,
    expiresAt: new Date(apiToken.expires_at),
  };
}
