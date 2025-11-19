import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { newUninitializedUser, User } from '@luna/contexts/api/auth/types';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface UserDeleteModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function UserDeleteModal({ id, isOpen, setOpen }: UserDeleteModalProps) {
  const [user, setUser] = useState<User>(newUninitializedUser());
  const auth = useContext(AuthContext);

  // initialize modal state
  useEffect(() => {
    if (!isOpen) return;

    const fetchUser = async () => {
      const userResult = await auth.getUserById(id);
      if (userResult.ok) {
        setUser(userResult.value);
      } else {
        console.log('Fetching user failed:', userResult.error);
        setUser(newUninitializedUser());
      }
    };
    fetchUser();
  }, [id, isOpen, auth]);

  const deleteUser = useCallback(async () => {
    const result = await auth.deleteUser(user.id);
    if (result.ok) {
      console.log('Deleted user: ', id);
    } else {
      console.log('Deleting user', id, 'failed:', result.error);
    }
    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [auth, id, setOpen, user.id]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Delete User</ModalHeader>
            <ModalBody>
              <span>
                Do you really want to delete the user{' '}
                <b>
                  {user.username} (ID: {user.id})
                </b>
                ?
              </span>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={deleteUser}>
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
