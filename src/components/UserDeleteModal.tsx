import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { newUninitializedUser, User } from '@luna/contexts/api/auth/types';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
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

  const deleteUser = useCallback(() => {
    console.log('deleting user with id', id);
    // TODO: call DELETE /users/<id>
    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [id, setOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Delete User</ModalHeader>
            <ModalBody>
              <Input label="ID" value={id.toString()} isDisabled />

              <Input
                label="Username"
                value={user.username}
                onValueChange={username => {
                  if (!user) return;
                  setUser({ ...user, username });
                }}
                isDisabled
              />
              <Input
                label="E-Mail"
                value={user.email}
                onValueChange={email => {
                  if (!user) return;
                  setUser({ ...user, email });
                }}
                isDisabled
              />
              <Input
                label="Created At"
                value={user.createdAt.toLocaleString()}
                isDisabled
              />
              <Input
                label="Updated At"
                value={user.updatedAt.toLocaleString()}
                isDisabled
              />
              <Input
                label="Last Login"
                value={user.lastSeen.toLocaleString()}
                isDisabled
              />
              <Checkbox
                isSelected={user.permanentApiToken}
                onValueChange={permanentApiToken => {
                  if (!user) return;
                  setUser({
                    ...user,
                    permanentApiToken,
                  });
                }}
                isDisabled
              >
                Permanent API Token
              </Checkbox>
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
