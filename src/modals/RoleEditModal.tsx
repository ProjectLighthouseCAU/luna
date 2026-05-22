import { AuthContext } from '@luna/contexts/api/auth/AuthContext';

import { newUninitializedRole, Role } from '@luna/contexts/api/auth/types';
import { CreateOrUpdateRolePayload } from '@luna/contexts/api/auth/types/CreateOrUpdateRolePayload';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface RoleEditModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function RoleEditModal({
  id,
  isOpen,
  setOpen,
  onSuccess,
}: RoleEditModalProps) {
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
        setRole(newUninitializedRole());
      }
    };
    fetchRole();
  }, [id, isOpen, auth]);

  const editRole = useCallback(async () => {
    const payload: CreateOrUpdateRolePayload = {
      name: role.name,
    };
    const result = await auth.updateRole(id, payload);
    if (result.ok) {
      console.log('Updated role', id, ':', payload);
      onSuccess();
    } else {
      console.log('Update role failed:', result.error);
    }
    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [role.name, auth, id, setOpen, onSuccess]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Edit Role</ModalHeader>
            <ModalBody>
              <Input label="ID" value={id.toString()} isDisabled />
              <Input
                label="Name"
                value={role.name}
                onValueChange={name => {
                  setRole({ ...role, name });
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="warning" onPress={editRole}>
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
