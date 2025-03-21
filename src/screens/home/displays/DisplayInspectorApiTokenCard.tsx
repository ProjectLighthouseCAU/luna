import { ApiTokenModal } from '@luna/modals/ApiTokenModal';
import { TitledCard } from '@luna/components/TitledCard';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { Button, Tooltip, useDisclosure } from '@heroui/react';
import { IconClipboard, IconKey, IconRefresh } from '@tabler/icons-react';
import { useCallback, useContext } from 'react';

export function DisplayInspectorApiTokenCard() {
  const auth = useContext(AuthContext);
  const { token } = auth;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const copyToClipboard = useCallback(() => {
    if (token) {
      navigator.clipboard.writeText(token.value);
    }
  }, [token]);

  const cycleToken = useCallback(async () => {
    await auth.cycleToken();
  }, [auth]);

  return (
    <TitledCard icon={<IconKey />} title="API Token">
      <div className="flex flex-row justify-center items-center space-x-1">
        <Button className="grow" size="sm" onPress={onOpen}>
          Reveal Token
        </Button>
        <ApiTokenModal
          token={token}
          cycleToken={cycleToken}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
        <Tooltip content="Copy the token">
          <Button isIconOnly size="sm" onPress={copyToClipboard}>
            <IconClipboard />
          </Button>
        </Tooltip>
        <Tooltip content="Generates a new token">
          <Button isIconOnly size="sm" onPress={cycleToken}>
            <IconRefresh />
          </Button>
        </Tooltip>
      </div>
    </TitledCard>
  );
}
