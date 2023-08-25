import { Token } from '@luna/client/auth/Token';
import { User } from '@luna/client/auth/User';
import { ApiTokenModal } from '@luna/components/ApiTokenModal';
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
      <UserComponent name={user.username} />
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
