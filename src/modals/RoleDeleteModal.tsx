import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { newUninitializedRole, Role } from '@luna/contexts/api/auth/types';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface RoleDeleteModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function RoleDeleteModal({
  id,
  isOpen,
  setOpen,
  onSuccess,
}: RoleDeleteModalProps) {
  const [role, setRole] = useState<Role>(newUninitializedRole());
  const auth = useContext(AuthContext);

  // initialize modal state
  useEffect(() => {
    if (!isOpen) return;

    const fetchRole = async () => {
      const roleResult = await auth.getRoleById(id);
      if (roleResult.ok) {
        setRole(roleResult.value);
      } else {
        console.log('Fetching role failed:', roleResult.error);
        setRole(newUninitializedRole());
      }
    };
    fetchRole();
  }, [id, isOpen, auth]);

  const deleteRole = useCallback(async () => {
    const result = await auth.deleteRole(role.id);
    if (result.ok) {
      console.log('Deleted role: ', id);
      onSuccess();
    } else {
      console.log('Deleting role', id, 'failed:', result.error);
    }
    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [auth, role.id, setOpen, id, onSuccess]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Delete Role</ModalHeader>
            <ModalBody>
              <span>
                Do you really want to delete the role{' '}
                <b>
                  {role.name} (ID: {role.id})
                </b>
                ?
              </span>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={deleteRole}>
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
