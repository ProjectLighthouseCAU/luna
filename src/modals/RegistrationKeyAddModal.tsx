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
import { ZonedDateTime } from '@internationalized/date';

export interface RegistrationKeyAddModalProps {
  isOpen: boolean;
  setOpen: (show: boolean) => void;
  onSuccess: () => void;
}

export function RegistrationKeyAddModal({
  isOpen,
  setOpen,
  onSuccess,
}: RegistrationKeyAddModalProps) {
  const [regKey, setRegKey] = useState<RegistrationKey>(
    newUninitializedRegistrationKey()
  );
  const [expirationDate, setExpirationDate] = useState<ZonedDateTime | null>(
    null
  );
  const [generate, setGenerate] = useState(true);

  // initialize/reset modal state
  useEffect(() => {
    if (!isOpen) return;
    setRegKey(newUninitializedRegistrationKey());
  }, [isOpen]);

  const auth = useContext(AuthContext);

  const addRegKey = useCallback(async () => {
    if (generate) {
      // this is a bit hacky but it achieves the same key format as before (6 groups of 4 alphanumeric characters)
      const randomPart = window.crypto
        .randomUUID()
        .replaceAll('-', '')
        .slice(0, 24)
        .toUpperCase()
        .match(/.{1,4}/g)
        ?.join('-');
      regKey.key += '_' + randomPart;
    }

    const payload: CreateOrUpdateRegistrationKeyPayload = {
      key: regKey.key,
      description: regKey.description,
      expires_at: regKey.expiresAt,
      permanent: regKey.permanent,
    };
    const result = await auth.createRegistrationKey(payload);
    if (result.ok) {
      console.log('added registration key:', payload);
      onSuccess();
    } else {
      console.log('failed to add registration key:', result.error);
    }
    // TODO: UI feedback from the request (success, error)
    setOpen(false);
  }, [setOpen, regKey, generate, onSuccess, auth]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Add Registration Key</ModalHeader>
            <ModalBody>
              {/* TODO: generate key with prefix */}
              <Input
                label="Key / Prefix"
                value={regKey.key}
                onValueChange={key => {
                  if (!regKey) return;
                  setRegKey({ ...regKey, key });
                }}
              />
              <Checkbox
                isSelected={generate}
                onValueChange={generate => {
                  setGenerate(generate);
                }}
              >
                Generate Random Key with Prefix
              </Checkbox>
              <Input
                label="Description"
                value={regKey.description}
                onValueChange={description => {
                  if (!regKey) return;
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
                  if (!regKey) return;
                  setRegKey({ ...regKey, permanent });
                }}
              >
                Permanent Key
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onPress={addRegKey}>
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
