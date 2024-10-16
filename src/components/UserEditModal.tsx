import {
  newUninitializedUser,
  RegistrationKey,
  Role,
  User,
} from '@luna/contexts/api/auth/types';
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

export interface UserEditModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function UserEditModal({ id, isOpen, setOpen }: UserEditModalProps) {
  const [user, setUser] = useState<User>(newUninitializedUser());
  const [password, setPassword] = useState('');

  // initialize modal state
  useEffect(() => {
    if (!isOpen) return;

    // TODO: remove test data and query the API
    const now = new Date();
    // TODO: call GET /users/<id>/roles
    const roles: Role[] = [
      {
        id: 1,
        name: 'Testrole',
        createdAt: now,
        updatedAt: now,
      },
    ];
    // TODO: call GET /users/<id>
    const registrationKey: RegistrationKey = {
      id: 1,
      key: 'Test-Registration-Key',
      description: 'Test-Registration-Key for testing purposes',
      createdAt: now,
      updatedAt: now,
      expiresAt: now,
      permanent: false,
    };
    const user: User = {
      username: 'Testuser',
      email: 'test@example.com',
      roles,
      createdAt: now,
      updatedAt: now,
      lastSeen: now,
      permanentApiToken: false,
      registrationKey,
    };

    setPassword('');
    setUser(user);
  }, [id, isOpen]);

  const editUser = useCallback(() => {
    const payload = {
      username: user.username,
      password,
      email: user.email,
      permanent_api_token: user.permanentApiToken,
    };
    console.log('updating user', id, ':', payload);
    // TODO: call PUT /users/<id>
    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [id, setOpen, user, password]);

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
                value={user.createdAt?.toLocaleString()}
                isDisabled
              />
              <Input
                label="Updated At"
                value={user.updatedAt?.toLocaleString()}
                isDisabled
              />
              <Input
                label="Last Login"
                value={user.lastSeen?.toLocaleString()}
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
