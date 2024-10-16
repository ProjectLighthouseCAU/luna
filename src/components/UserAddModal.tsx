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
import { useCallback, useEffect, useState } from 'react';

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

  const addUser = useCallback(() => {
    const payload = {
      username: user.username,
      password,
      email: user.email,
      permanent_api_token: user.permanentApiToken,
    };
    console.log('adding user:', payload);
    // TODO: call POST /users
    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [setOpen, user, password]);

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
              <Checkbox
                isSelected={user.permanentApiToken}
                onValueChange={permanentApiToken => {
                  if (!user) return;
                  setUser({
                    ...user,
                    permanentApiToken,
                  });
                }}
              >
                Permanent API Token
              </Checkbox>
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
