import {
  newUninitializedUser,
  RegistrationKey,
  Role,
  User,
} from '@luna/api/auth/types';
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

export interface UserDeleteModalProps {
  id: number;
  show: boolean;
  setShow: (show: boolean) => void;
}

export function UserDeleteModal({ id, show, setShow }: UserDeleteModalProps) {
  const [user, setUser] = useState<User>(newUninitializedUser());

  // initialize modal state
  useEffect(() => {
    // only initialize when the modal is shown
    if (!show) return;

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

    setUser(user);
  }, [id, show]);

  const deleteUser = () => {
    console.log('deleting user with id', id);
    // TODO: call DELETE /users/<id>
    // TODO: feedback from the request (success, error)
    onOpenChange(false);
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setUser(newUninitializedUser());
    }
    setShow(isOpen);
  };

  return (
    <Modal isOpen={show} onOpenChange={onOpenChange}>
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
