import { AuthContext } from '@luna/contexts/api/auth/AuthContext';

import {
  newUninitializedRegistrationKey,
  RegistrationKey,
} from '@luna/contexts/api/auth/types';
import {
  Button,
  Checkbox,
  DateInput,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { CreateOrUpdateRegistrationKeyPayload } from '@luna/contexts/api/auth/types/CreateOrUpdateRegistrationKeyPayload';
import { ZonedDateTime, parseAbsoluteToLocal } from '@internationalized/date';

export interface RegistrationKeyEditModalProps {
  id: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function RegistrationKeyEditModal({
  id,
  isOpen,
  setOpen,
  onSuccess,
}: RegistrationKeyEditModalProps) {
  const [regKey, setRegKey] = useState<RegistrationKey>(
    newUninitializedRegistrationKey()
  );
  const [expirationDate, setExpirationDate] = useState<ZonedDateTime | null>();

  const auth = useContext(AuthContext);

  // initialize modal state
  useEffect(() => {
    if (!isOpen) return;
    const fetchRegistrationKey = async () => {
      const regKeyResult = await auth.getRegistrationKeyById(id);
      if (regKeyResult.ok) {
        setRegKey(regKeyResult.value);
        setExpirationDate(
          parseAbsoluteToLocal(regKeyResult.value.expiresAt.toISOString())
        );
      } else {
        setRegKey(newUninitializedRegistrationKey());
      }
    };
    fetchRegistrationKey();
  }, [id, isOpen, auth]);

  const editRegistrationKey = useCallback(async () => {
    const expiresAt = expirationDate?.toDate();

    const payload: CreateOrUpdateRegistrationKeyPayload = {
      key: regKey.key,
      description: regKey.description,
      expires_at: expiresAt ?? regKey.expiresAt,
      permanent: regKey.permanent,
    };
    const result = await auth.updateRegistrationKey(id, payload);
    if (result.ok) {
      console.log('Updated registration key', id, ':', payload);
      onSuccess();
    } else {
      console.log('Update registration key failed:', result.error);
    }

    // TODO: feedback from the request (success, error)
    setOpen(false);
  }, [
    expirationDate,
    regKey.key,
    regKey.description,
    regKey.expiresAt,
    regKey.permanent,
    auth,
    id,
    setOpen,
    onSuccess,
  ]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Edit Registration Key</ModalHeader>
            <ModalBody>
              <Input label="ID" value={id.toString()} isDisabled />
              <Input label="Key" value={regKey.key} isDisabled />
              <Input
                label="Description"
                value={regKey.description}
                onValueChange={description => {
                  setRegKey({ ...regKey, description });
                }}
              />

              <DateInput
                className="max-w-md"
                granularity="minute"
                label="Expires At"
                value={expirationDate}
                onChange={setExpirationDate}
              />

              <Checkbox
                isSelected={regKey.permanent}
                onValueChange={permanent => {
                  setRegKey({ ...regKey, permanent });
                }}
              >
                Permanent Registration Key
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button color="warning" onPress={editRegistrationKey}>
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
