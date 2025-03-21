import { Token } from '@luna/contexts/api/auth/types';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  Snippet,
} from '@heroui/react';
import { IconRefresh } from '@tabler/icons-react';

export interface ApiTokenModalProps {
  username?: string;
  token: Token | null | undefined;
  cycleToken: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ApiTokenModal({
  username,
  token,
  cycleToken,
  isOpen,
  onOpenChange,
}: ApiTokenModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>
              {username ? `API Token for ${username}` : 'Your API Token'}
            </ModalHeader>
            <ModalBody className="p-4">
              {token !== undefined ? (
                <>
                  {token?.expiresAt ? (
                    <p>
                      {`The token is valid through ${token.expiresAt.toLocaleString()}.`}
                    </p>
                  ) : null}
                  <Snippet symbol="" disableCopy={token === null}>
                    {token?.value ?? 'No token available'}
                  </Snippet>
                  <Button onPress={cycleToken} variant="bordered">
                    <IconRefresh />
                    Generate New Token
                  </Button>
                </>
              ) : (
                <Skeleton className="h-24 rounded" />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
