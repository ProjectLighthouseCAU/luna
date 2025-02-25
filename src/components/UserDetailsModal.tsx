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
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';

export interface UserShowModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function UserDetailsModal({ id, isOpen, setOpen }: UserShowModalProps) {
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
        console.log('Failed to fetch user:', userResult.error);
        setUser(newUninitializedUser);
      }
    };
    fetchUser();
  }, [auth, id, isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>User</ModalHeader>
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
              {/* TODO: find better component for displaying list of roles */}
              <Select label="Roles" items={user.roles || []}>
                {role => <SelectItem key={role.id}>{role.name}</SelectItem>}
              </Select>
              <Input
                label="Registration Key"
                value={user.registrationKey?.key}
                isDisabled
              />
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>Cancel</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
