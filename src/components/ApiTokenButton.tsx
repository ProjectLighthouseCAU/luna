import { Token } from '@luna/contexts/api/auth/types';
import { ApiTokenModal } from '@luna/modals/ApiTokenModal';
import { Button, Tooltip, useDisclosure } from '@heroui/react';
import { IconKey } from '@tabler/icons-react';

export interface ApiTokenButtonProps {
  token: Token | null;
  cycleToken: () => void;
}

export function ApiTokenButton({ token, cycleToken }: ApiTokenButtonProps) {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Tooltip content="Show the API token" placement="right">
        <Button isIconOnly size="sm" onPress={onOpen}>
          <IconKey />
        </Button>
      </Tooltip>
      <ApiTokenModal
        token={token}
        cycleToken={cycleToken}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
