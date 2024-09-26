import { Role } from '@luna/api/auth/types/Role';

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
