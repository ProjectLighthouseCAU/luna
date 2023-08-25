import { Token } from '@luna/client/auth/Token';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  Snippet,
} from '@nextui-org/react';

export interface ApiTokenModalProps {
  token: Token | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ApiTokenModal({
  token,
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
  );
}
