export interface Token {
  value: string;
  expiresAt: Date;
  username: string;
  roles: string[];
}
