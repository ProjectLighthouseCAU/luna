import { DisplayInspectorCard } from '@luna/screens/home/displays/DisplayInspectorCard';
import {
  Button,
  Code,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { IconClipboard, IconLink } from '@tabler/icons-react';

export function DisplayInspectorApiTokenCard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // TODO: Use actual API token

  return (
    <DisplayInspectorCard icon={<IconLink />} title="API Token">
      <div className="flex flex-row items-center space-x-1">
        <Tooltip content="Show the token">
          <Button size="md" onPress={onOpen}>
            Reveal
          </Button>
        </Tooltip>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {onClose => (
              <>
                <ModalHeader>API Token</ModalHeader>
                <ModalBody className="p-4">
                  <p>Your token is valid through DD.MM.2023.</p>
                  <Code>API-Tok-ABC</Code>
                  <Button>
                    <IconClipboard />
                    Copy Token
                  </Button>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
        <Tooltip content="Copy the token">
          <Button isIconOnly size="md">
            <IconClipboard />
          </Button>
        </Tooltip>
      </div>
    </DisplayInspectorCard>
  );
}
