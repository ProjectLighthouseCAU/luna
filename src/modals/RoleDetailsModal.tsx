import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import {
  newUninitializedRole,
  Role,
  User,
} from '@luna/contexts/api/auth/types';
import {
  Button,
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

export interface RoleShowModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function RoleDetailsModal({ id, isOpen, setOpen }: RoleShowModalProps) {
  const [role, setRole] = useState<Role>(newUninitializedRole());
  const [users, setUsers] = useState<User[]>([]);
  const auth = useContext(AuthContext);

  // initialize modal state
  useEffect(() => {
    if (!isOpen) return;
    const fetchRole = async () => {
      const roleResult = await auth.getRoleById(id);
      if (roleResult.ok) {
        setRole(roleResult.value);
      } else {
        console.log('Failed to fetch role:', roleResult.error);
        setRole(newUninitializedRole());
      }
      const usersResult = await auth.getUsersOfRole(id);
      if (usersResult.ok) {
        setUsers(usersResult.value);
      } else {
        console.log('Failed to fetch users of role:', usersResult.error);
        setRole(newUninitializedRole());
      }
    };
    fetchRole();
  }, [auth, id, isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Role</ModalHeader>
            <ModalBody>
              <Input label="ID" value={id.toString()} isDisabled />
              <Input label="Name" value={role.name} />
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
