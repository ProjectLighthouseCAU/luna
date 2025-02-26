import { ApiTokenModal } from '@luna/components/ApiTokenModal';
import { TitledCard } from '@luna/components/TitledCard';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { Button, Tooltip, useDisclosure } from '@heroui/react';
import { IconClipboard, IconKey } from '@tabler/icons-react';
import { useCallback, useContext } from 'react';

export function DisplayInspectorApiTokenCard() {
  const { token } = useContext(AuthContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const copyToClipboard = useCallback(() => {
    if (token) {
      navigator.clipboard.writeText(token.value);
    }
  }, [token]);

  return (
    <TitledCard icon={<IconKey />} title="API Token">
      <div className="flex flex-row items-center space-x-1">
        <Tooltip content="Show the token">
          <Button size="md" onPress={onOpen}>
            Reveal
          </Button>
        </Tooltip>
        <ApiTokenModal
          token={token}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
        <Tooltip content="Copy the token">
          <Button isIconOnly size="md" onPress={copyToClipboard}>
            <IconClipboard />
          </Button>
        </Tooltip>
      </div>
    </TitledCard>
  );
}
