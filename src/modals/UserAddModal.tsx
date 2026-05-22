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
  onSuccess: () => void;
}

export function UserAddModal({
  isOpen,
  setOpen,
  onSuccess,
}: UserAddModalProps) {
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
      onSuccess();
    } else {
      console.log('failed to add user:', result.error);
    }
    // TODO: UI feedback from the request (success, error)
    setOpen(false);
  }, [user.username, user.email, password, auth, setOpen, onSuccess]);

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
