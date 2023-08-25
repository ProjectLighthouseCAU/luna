import { Role } from '@luna/client/auth/Role';

export interface RoleSnippetProps {
  role: Role;
}

export function RoleSnippet({ role }: RoleSnippetProps) {
  switch (role) {
    case Role.Admin:
      return <>Admin</>;
    case Role.User:
      return <>User</>;
  }
}
