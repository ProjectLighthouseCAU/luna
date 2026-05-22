import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import {
  newUninitializedRegistrationKey,
  RegistrationKey,
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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useContext, useEffect, useState } from 'react';

export interface RegistrationKeyShowModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function RegistrationKeyDetailsModal({
  id,
  isOpen,
  setOpen,
}: RegistrationKeyShowModalProps) {
  const [regKey, setRegKey] = useState<RegistrationKey>(
    newUninitializedRegistrationKey()
  );
  const [users, setUsers] = useState<User[]>([]);
  const auth = useContext(AuthContext);

  // initialize modal state
  useEffect(() => {
    if (!isOpen) return;
    const fetchRegistrationKey = async () => {
      const regKeyResult = await auth.getRegistrationKeyById(id);
      if (regKeyResult.ok) {
        setRegKey(regKeyResult.value);
      } else {
        console.log('Failed to fetch registration key:', regKeyResult.error);
        setRegKey(newUninitializedRegistrationKey());
      }
      const usersResult = await auth.getUsersOfRegistrationKey(id);
      if (usersResult.ok) {
        setUsers(usersResult.value);
      } else {
        console.log(
          'Failed to fetch users of registration key:',
          usersResult.error
        );
        setRegKey(newUninitializedRegistrationKey());
      }
    };
    fetchRegistrationKey();
  }, [auth, id, isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Registration Key</ModalHeader>
            <ModalBody>
              <Input label="ID" value={id.toString()} isDisabled />
              <Input label="Key" value={regKey.key} />
              <Input label="Description" value={regKey.description} />
              <Input
                label="Expires At"
                value={regKey.expiresAt.toLocaleString()}
              />
              <Checkbox isSelected={regKey.permanent}>
                Permanent Registration Key
              </Checkbox>
              Users:
              <Table>
                <TableHeader>
                  <TableColumn key="id" allowsSorting>
                    ID
                  </TableColumn>
                  <TableColumn key="id" allowsSorting>
                    Username
                  </TableColumn>
                </TableHeader>
                <TableBody items={users}>
                  {user => (
                    <TableRow key={user.username}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
