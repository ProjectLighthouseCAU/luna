import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { newUninitializedUser, User } from '@luna/contexts/api/auth/types';
import { CreateOrUpdateUserPayload } from '@luna/contexts/api/auth/types/CreateOrUpdateUserPayload';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface UserAddModalProps {
  isOpen: boolean;
  setOpen: (show: boolean) => void;
}

export function UserAddModal({ isOpen, setOpen }: UserAddModalProps) {
  const [user, setUser] = useState<User>(newUninitializedUser());
  const [password, setPassword] = useState('');

  // initialize/reset modal state
  useEffect(() => {
    if (!isOpen) return;
    setUser(newUninitializedUser());
    setPassword('');
  }, [isOpen]);

  const auth = useContext(AuthContext);

  const addUser = useCallback(async () => {
    const payload: CreateOrUpdateUserPayload = {
      username: user.username,
      password,
      email: user.email,
    };
    const result = await auth.createUser(payload);
    if (result.ok) {
      console.log('added user:', payload);
    } else {
      console.log('failed to add user:', result.error);
    }
    // TODO: UI feedback from the request (success, error)
    setOpen(false);
  }, [setOpen, user, password, auth]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Add User</ModalHeader>
            <ModalBody>
              <Input
                label="Username"
                value={user.username}
                onValueChange={username => {
                  if (!user) return;
                  setUser({ ...user, username });
                }}
              />
              <Input
                type="password"
                label="Password"
                value={password}
                onValueChange={setPassword}
              />
              <Input
                label="E-Mail"
                value={user.email}
                onValueChange={email => {
                  if (!user) return;
                  setUser({ ...user, email });
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="success" onPress={addUser}>
                Add
              </Button>
              <Button onPress={onClose}>Cancel</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
