import { RegistrationKey, Role, User } from '@luna/api/auth/types';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';

export interface UserModalProps {
  id: number;
  action: 'view' | 'add' | 'edit' | 'delete';
  show: boolean;
  setShow: (show: boolean) => void;
}

// TODO: maybe split up the modal into AddUserModal, ShowUserModal, EditUserModal and DeleteUserModal
// FIXME: console warning: "WARN: A component changed from uncontrolled to controlled."
export function UserModal({ id, action, show, setShow }: UserModalProps) {
  const [user, setUser] = useState<User>({ username: '' });
  const [password, setPassword] = useState('');

  // initialize modal state
  useEffect(() => {
    // only initialize when the modal is shown
    if (!show) return;

    if (action === 'add') {
      setUser({
        username: '',
      });
      setPassword('');
      return;
    }
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
  }, [id, action, show]);

  const addUser = () => {
    const payload = {
      username: user.username,
      password: password,
      email: user.email,
      permanent_api_token: user.permanentApiToken,
    };
    console.log('adding user:', payload);
    // TODO: call POST /users
    // TODO: feedback from the request (success, error)
    onOpenChange(false);
  };

  const editUser = () => {
    const payload = {
      username: user.username,
      password: password,
      email: user.email,
      permanent_api_token: user.permanentApiToken,
    };
    console.log('updating user:', payload);
    // TODO: call PUT /users/<id>
    // TODO: feedback from the request (success, error)
    onOpenChange(false);
  };

  const deleteUser = () => {
    console.log('deleting user with id', id);
    // TODO: call DELETE /users/<id>
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
            <ModalHeader>
              {action.charAt(0).toUpperCase() + action.slice(1)} User
            </ModalHeader>
            <ModalBody>
              {action !== 'add' && (
                <Input label="ID" value={id.toString()} isDisabled />
              )}
              <Input
                label="Username"
                value={user.username}
                onValueChange={username => {
                  if (!user) return;
                  setUser({ ...user, username });
                }}
                isDisabled={action === 'view' || action === 'delete'}
              />
              {(action === 'add' || action === 'edit') && (
                <Input
                  type="password"
                  label="Password"
                  description={
                    action === 'edit'
                      ? 'Leave empty to keep previous password'
                      : ''
                  }
                  value={password}
                  onValueChange={setPassword}
                />
              )}
              <Input
                label="E-Mail"
                value={user.email}
                onValueChange={email => {
                  if (!user) return;
                  setUser({ ...user, email });
                }}
                isDisabled={action === 'view' || action === 'delete'}
              />
              {action !== 'add' && (
                <>
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
                </>
              )}
              <Checkbox
                isSelected={user.permanentApiToken}
                onValueChange={permanentApiToken => {
                  if (!user) return;
                  setUser({
                    ...user,
                    permanentApiToken,
                  });
                }}
                isDisabled={action === 'view' || action === 'delete'}
              >
                Permanent API Token
              </Checkbox>
              {action === 'view' && (
                <>
                  {/* TODO: find better component for displaying list of roles */}
                  <Select label="Roles" items={user.roles || []}>
                    {role => <SelectItem key={role.id}>{role.name}</SelectItem>}
                  </Select>
                  <Input
                    label="Registration Key"
                    value={user.registrationKey?.key}
                    isDisabled={action === 'view'}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {action === 'add' && (
                <Button color="success" onPress={addUser}>
                  Add
                </Button>
              )}
              {action === 'edit' && (
                <Button color="warning" onPress={editUser}>
                  Save
                </Button>
              )}
              {action === 'delete' && (
                <Button color="danger" onPress={deleteUser}>
                  Delete
                </Button>
              )}
              <Button onPress={onClose}>Cancel</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
