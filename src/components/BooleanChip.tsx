import { Chip } from '@heroui/react';

export interface BooleanChipProps {
  value: boolean;
}

export function BooleanChip({ value }: BooleanChipProps) {
  return (
    <Chip color={value ? 'success' : 'danger'} variant="flat">
      {value ? 'true' : 'false'}
    </Chip>
  );
}
