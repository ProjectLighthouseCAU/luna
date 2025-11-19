export interface Token {
  value: string;
  expiresAt: Date;
  username: string;
  permanent: boolean;
  roles: string[];
}
