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

export interface RoleAddModalProps {
  isOpen: boolean;
  setOpen: (show: boolean) => void;
  onSuccess: () => void;
}

export function RoleAddModal({
  isOpen,
  setOpen,
  onSuccess,
}: RoleAddModalProps) {
  const [role, setRole] = useState<Role>(newUninitializedRole());

  // initialize/reset modal state
  useEffect(() => {
    if (!isOpen) return;
    setRole(newUninitializedRole());
  }, [isOpen]);

  const auth = useContext(AuthContext);

  const addRole = useCallback(async () => {
    const payload: CreateOrUpdateRolePayload = {
      name: role.name,
    };
    const result = await auth.createRole(payload);
    if (result.ok) {
      console.log('added role:', payload);
      onSuccess();
    } else {
      console.log('failed to add role:', result.error);
    }
    // TODO: UI feedback from the request (success, error)
    setOpen(false);
  }, [role.name, auth, setOpen, onSuccess]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Add Role</ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                value={role.name}
                onValueChange={name => {
                  setRole({ ...role, name });
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="success" onPress={addRole}>
                Add
              </Button>
              <Button onPress={onClose}>Cancel</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
