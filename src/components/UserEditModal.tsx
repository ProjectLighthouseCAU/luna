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
} from '@nextui-org/react';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface UserEditModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function UserEditModal({ id, isOpen, setOpen }: UserEditModalProps) {
  const [user, setUser] = useState<User>(newUninitializedUser());
  const [password, setPassword] = useState('');

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
    };
    fetchUser();
  }, [id, isOpen, auth]);

  const editUser = useCallback(async () => {
    const payload: CreateOrUpdateUserPayload = {
      username: user.username,
      password,
      email: user.email,
      permanent_api_token: user.permanentApiToken,
    };
    const result = await auth.updateUser(id, payload);
    if (result.ok) {
      console.log('Updated user', id, ':', payload);
    } else {
      console.log('Update user failed:', result.error);
    }
    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [user, password, auth, id, setOpen]);

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
