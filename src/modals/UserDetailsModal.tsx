import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { newUninitializedUser, User } from '@luna/contexts/api/auth/types';
import {
  Button,
  Checkbox,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useContext, useEffect, useState } from 'react';

export interface UserShowModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function UserDetailsModal({ id, isOpen, setOpen }: UserShowModalProps) {
  const [user, setUser] = useState<User>(newUninitializedUser());
  const [permanentApiToken, setPermanentApiToken] = useState<boolean>(false);
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
        setUser(newUninitializedUser());
      }
      const tokenResult = await auth.getToken(id);
      if (tokenResult.ok) {
        setPermanentApiToken(tokenResult.value.permanent);
      } else {
        console.log('Failed to fetch token:', tokenResult.error);
        setPermanentApiToken(false);
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
              <Input label="Username" value={user.username} />
              <Input label="E-Mail" value={user.email} />
              <Input
                label="Created At"
                value={user.createdAt.toLocaleString()}
              />
              <Input
                label="Updated At"
                value={user.updatedAt.toLocaleString()}
              />
              <Input
                label="Last Login"
                value={user.lastSeen.toLocaleString()}
              />
              <Input
                label="Registration Key"
                value={user.registrationKey ? user.registrationKey.key : ''}
              />
              <Checkbox isSelected={permanentApiToken}>
                Permanent API Token
              </Checkbox>
              Roles:
              {user.roles.map(role => (
                <Chip key={role.id}>{role.name}</Chip>
              ))}
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
