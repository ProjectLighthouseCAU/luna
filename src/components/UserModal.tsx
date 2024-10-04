import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

export interface UserModalProps {
  id: number;
  action: 'view' | 'add' | 'edit' | 'delete';
  show: boolean;
  setShow: (show: boolean) => void;
}
export function UserModal({ id, action, show, setShow }: UserModalProps) {
  return (
    <Modal isOpen={show} onOpenChange={isOpen => setShow(isOpen)}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>
              {action.charAt(0).toUpperCase() + action.slice(1)} User
            </ModalHeader>
            <ModalBody>ID: {id}</ModalBody>
            <ModalFooter>
              <Button
                onPress={() => {
                  setShow(false);
                  onClose();
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
