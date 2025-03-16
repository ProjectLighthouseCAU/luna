import { Modal, ModalContent } from '@heroui/react';

export interface QuickSwitcherModalProps {
  isOpen: boolean;
  setOpen: (show: boolean) => void;
}

export function QuickSwitcherModal({
  isOpen,
  setOpen,
}: QuickSwitcherModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>{onClose => <>TODO</>}</ModalContent>
    </Modal>
  );
}
