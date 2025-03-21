import { ApiTokenModal } from '@luna/modals/ApiTokenModal';
import { TitledCard } from '@luna/components/TitledCard';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { Button, Tooltip, useDisclosure } from '@heroui/react';
import { IconClipboard, IconKey, IconRefresh } from '@tabler/icons-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { Token } from '@luna/contexts/api/auth/types';

export interface DisplayInspectorApiTokenCardProps {
  username: string;
}

export function DisplayInspectorApiTokenCard({
  username,
}: DisplayInspectorApiTokenCardProps) {
  const auth = useContext(AuthContext);
  const { users } = useContext(ModelContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [token, setToken] = useState<Token | null>(); // undefined means loading, null means unavailable

  const userId = users.all.get(username)?.id;

  const copyToClipboard = useCallback(() => {
    if (token) {
      navigator.clipboard.writeText(token.value);
    }
  }, [token]);

  const cycleToken = useCallback(async () => {
    await auth.cycleToken(userId);
  }, [auth, userId]);

  useEffect(() => {
    (async () => {
      if (userId) {
        const result = await auth.getToken(userId);
        if (result.ok) {
          setToken(result.value);
          return;
        } else {
          console.warn(`Could not fetch token: ${result.error}`);
        }
      }
      setToken(null);
    })();
  }, [auth, userId]);

  return (
    <TitledCard icon={<IconKey />} title="API Token">
      <div className="flex flex-row justify-center items-center space-x-1">
        <Button className="grow" size="sm" onPress={onOpen}>
          Reveal Token
        </Button>
        <ApiTokenModal
          username={username}
          token={token}
          cycleToken={cycleToken}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
        <Tooltip content="Copy the token">
          <Button
            isIconOnly
            size="sm"
            onPress={copyToClipboard}
            isDisabled={!token}
          >
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
