import { AuthContext } from '@luna/contexts/api/auth/AuthContext';

import { newUninitializedUser, User } from '@luna/contexts/api/auth/types';
import { CreateOrUpdateUserPayload } from '@luna/contexts/api/auth/types/CreateOrUpdateUserPayload';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface UserEditModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function UserEditModal({ id, isOpen, setOpen }: UserEditModalProps) {
  const [user, setUser] = useState<User>(newUninitializedUser());
  const [password, setPassword] = useState('');
  const [permanentApiToken, setPermanentApiToken] = useState<boolean>(false);

  const auth = useContext(AuthContext);

  // initialize modal state
  useEffect(() => {
    if (!isOpen) return;
    const fetchUser = async () => {
      const userResult = await auth.getUserById(id);
      if (userResult.ok) {
        setUser(userResult.value);
        setPassword('');
      } else {
        setUser(newUninitializedUser());
        setPassword('');
      }
      const tokenResult = await auth.getToken(id);
      if (tokenResult.ok) {
        setPermanentApiToken(tokenResult.value.permanent);
      }
    };
    fetchUser();
  }, [id, isOpen, auth]);

  const editUser = useCallback(async () => {
    const payload: CreateOrUpdateUserPayload = {
      username: user.username,
      password,
      email: user.email,
    };
    const result = await auth.updateUser(id, payload);
    if (result.ok) {
      console.log('Updated user', id, ':', payload);
    } else {
      console.log('Update user failed:', result.error);
    }

    const resultToken = await auth.updateToken(id, {
      permanent: permanentApiToken,
    });
    if (resultToken.ok) {
      console.log('Update token', id, ': permanent =', permanentApiToken);
    } else {
      console.log('Update token failed:', resultToken.error);
    }

    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [user, password, permanentApiToken, auth, id, setOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Edit User</ModalHeader>
            <ModalBody>
              <Input label="ID" value={id.toString()} isDisabled />
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
                description="Leave empty to keep previous password"
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
                isSelected={permanentApiToken}
                onValueChange={permanentApiToken => {
                  setPermanentApiToken(permanentApiToken);
                }}
              >
                Permanent API Token
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button color="warning" onPress={editUser}>
                Save
              </Button>
              <Button onPress={onClose}>Cancel</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
