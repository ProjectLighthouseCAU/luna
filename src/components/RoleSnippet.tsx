import { Role } from '@luna/api/auth/types';

export interface RoleSnippetProps {
  roles: Role[];
}

export function RoleSnippet({ roles }: RoleSnippetProps) {
  return <>{roles.map(role => role.name)}</>;
}
