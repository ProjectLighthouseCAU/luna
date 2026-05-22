import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import {
  newUninitializedRegistrationKey,
  RegistrationKey,
} from '@luna/contexts/api/auth/types';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface RegistrationKeyDeleteModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function RegistrationKeyDeleteModal({
  id,
  isOpen,
  setOpen,
  onSuccess,
}: RegistrationKeyDeleteModalProps) {
  const [regKey, setRegKey] = useState<RegistrationKey>(
    newUninitializedRegistrationKey()
  );
  const auth = useContext(AuthContext);

  // initialize modal state
  useEffect(() => {
    if (!isOpen) return;

    const fetchRegistrationKey = async () => {
      const regKeyResult = await auth.getRegistrationKeyById(id);
      if (regKeyResult.ok) {
        setRegKey(regKeyResult.value);
      } else {
        console.log('Fetching registration key failed:', regKeyResult.error);
        setRegKey(newUninitializedRegistrationKey());
      }
    };
    fetchRegistrationKey();
  }, [id, isOpen, auth]);

  const deleteRegistrationKey = useCallback(async () => {
    const result = await auth.deleteRegistrationKey(regKey.id);
    if (result.ok) {
      console.log('Deleted registration key: ', id);
      onSuccess();
    } else {
      console.log('Deleting registration key', id, 'failed:', result.error);
    }
    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [auth, id, setOpen, regKey.id, onSuccess]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Delete Registration Key</ModalHeader>
            <ModalBody>
              <span>
                Do you really want to delete the registration key{' '}
                <b>
                  {regKey.key} (ID: {regKey.id})
                </b>
                ?
              </span>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={deleteRegistrationKey}>
                Delete
              </Button>
              <Button onPress={onClose}>Cancel</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
