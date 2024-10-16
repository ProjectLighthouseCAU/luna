import { User } from '@luna/api/auth/types';
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
import { useEffect, useState } from 'react';

export interface UserAddModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export function UserAddModal({ show, setShow }: UserAddModalProps) {
  const [user, setUser] = useState<User>({ username: '' });
  const [password, setPassword] = useState('');

  // initialize/reset modal state
  useEffect(() => {
    setUser({
      username: '',
    });
    setPassword('');
  }, [show]);

  const addUser = () => {
    const payload = {
      username: user.username,
      password,
      email: user.email,
      permanent_api_token: user.permanentApiToken,
    };
    console.log('adding user:', payload);
    // TODO: call POST /users
    // TODO: feedback from the request (success, error)
    onOpenChange(false);
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setUser({ username: '' });
      setPassword('');
    }
    setShow(isOpen);
  };

  return (
    <Modal isOpen={show} onOpenChange={onOpenChange}>
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
