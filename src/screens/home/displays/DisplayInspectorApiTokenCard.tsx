import { Token } from '@luna/client/auth/Token';
import { ApiTokenModal } from '@luna/components/ApiTokenModal';
import { TitledCard } from '@luna/components/TitledCard';
import { AuthContext } from '@luna/contexts/AuthContext';
import { Button, Tooltip, useDisclosure } from '@nextui-org/react';
import { IconClipboard, IconLink } from '@tabler/icons-react';
import { useCallback, useContext, useEffect, useState } from 'react';

export function DisplayInspectorApiTokenCard() {
  const [token, setToken] = useState<Token | null>(null);
  const auth = useContext(AuthContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    (async () => {
      setToken(await auth.client.getToken());
    })();
  }, [auth.client]);

  const copyToClipboard = useCallback(() => {
    if (token) {
      navigator.clipboard.writeText(token.token);
    }
  }, [token]);

  return (
    <TitledCard icon={<IconLink />} title="API Token">
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
