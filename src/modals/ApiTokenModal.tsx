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
  token: Token | null;
  cycleToken: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ApiTokenModal({
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
            <ModalHeader>API Token</ModalHeader>
            <ModalBody className="p-4">
              {token ? (
                <>
                  {token.expiresAt ? (
                    <p>
                      {`Your token is valid through ${token.expiresAt.toLocaleString()}.`}
                    </p>
                  ) : null}
                  <Snippet symbol="">{token.value}</Snippet>
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
