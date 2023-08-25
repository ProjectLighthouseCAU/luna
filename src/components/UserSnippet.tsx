import { Token } from '@luna/client/auth/Token';
import { ApiTokenModal } from '@luna/components/ApiTokenModal';
import { Button, Tooltip, User, useDisclosure } from '@nextui-org/react';
import { IconKey } from '@tabler/icons-react';

export interface UserSnippetProps {
  username: string | null;
  token: Token | null;
}

export function UserSnippet({ username, token }: UserSnippetProps) {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex flex-row justify-between gap-1">
      <User name={username} />
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
