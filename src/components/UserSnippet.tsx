import { Token, User } from '@luna/api/auth/types';
import { ApiTokenModal } from '@luna/components/ApiTokenModal';
import { RoleSnippet } from '@luna/components/RoleSnippet';
import {
  Button,
  Tooltip,
  User as UserComponent,
  useDisclosure,
} from '@nextui-org/react';
import { IconKey } from '@tabler/icons-react';

export interface UserSnippetProps {
  user: User;
  token: Token | null;
}

export function UserSnippet({ user, token }: UserSnippetProps) {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex flex-row justify-between gap-1">
      <UserComponent
        name={user.username}
        description={user.roles ? <RoleSnippet roles={user.roles} /> : null}
      />
      <Tooltip content="Show the API token">
        <Button isIconOnly onPress={onOpen}>
          <IconKey />
        </Button>
      </Tooltip>
      <ApiTokenModal
        token={token}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
