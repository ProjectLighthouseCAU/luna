import { Token, User } from '@luna/contexts/api/auth/types';
import { ApiTokenButton } from '@luna/components/ApiTokenButton';
import { RoleSnippet } from '@luna/components/RoleSnippet';
import { User as UserComponent } from '@heroui/react';

export interface UserSnippetProps {
  user: User;
  token: Token | null;
  cycleToken: () => void;
}

export function UserSnippet({ user, token, cycleToken }: UserSnippetProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-1">
      <UserComponent
        name={user.username}
        description={<RoleSnippet roles={user.roles} />}
      />
      <ApiTokenButton token={token} cycleToken={cycleToken} />
    </div>
  );
}
