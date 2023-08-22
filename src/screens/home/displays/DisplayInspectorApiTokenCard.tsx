import { Token } from '@luna/client/auth/Token';
import { AuthContext } from '@luna/contexts/AuthContext';
import { DisplayInspectorCard } from '@luna/screens/home/displays/DisplayInspectorCard';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  Snippet,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
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
    <DisplayInspectorCard icon={<IconLink />} title="API Token">
      <div className="flex flex-row items-center space-x-1">
        <Tooltip content="Show the token">
          <Button size="md" onPress={onOpen}>
            Reveal
          </Button>
        </Tooltip>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {onClose => (
              <>
                <ModalHeader>API Token</ModalHeader>
                <ModalBody className="p-4">
                  {token ? (
                    <>
                      {token.expiresAt ? (
                        <p>
                          {`Your token is valid through ${token.expiresAt.toLocaleDateString()}.`}
                        </p>
                      ) : null}
                      <Snippet symbol="">{token.token}</Snippet>
                    </>
                  ) : (
                    <Skeleton className="h-24 rounded" />
                  )}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
        <Tooltip content="Copy the token">
          <Button isIconOnly size="md" onPress={copyToClipboard}>
            <IconClipboard />
          </Button>
        </Tooltip>
      </div>
    </DisplayInspectorCard>
  );
}
