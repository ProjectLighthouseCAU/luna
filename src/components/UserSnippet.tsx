import { Token, User } from '@luna/api/auth/types';
import { ApiTokenButton } from '@luna/components/ApiTokenButton';
import { RoleSnippet } from '@luna/components/RoleSnippet';
import { User as UserComponent } from '@nextui-org/react';

export interface UserSnippetProps {
  user: User;
  token: Token | null;
}

export function UserSnippet({ user, token }: UserSnippetProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-1">
      <UserComponent
        name={user.username}
        description={user.roles ? <RoleSnippet roles={user.roles} /> : null}
      />
      <ApiTokenButton token={token} />
    </div>
  );
}
