import { Button, Input } from '@heroui/react';
import { useCallback, useState } from 'react';

export interface SimpleEditFormProps {
  initialValue?: string;
  onSubmit: (value: string) => void;
}

export function SimpleEditForm({
  initialValue = '',
  onSubmit,
}: SimpleEditFormProps) {
  const [value, setValue] = useState<string>(initialValue);

  const doSubmit = useCallback(() => {
    onSubmit(value);
  }, [onSubmit, value]);

  return (
    <form
      className="flex flex-row gap-2"
      onSubmit={e => {
        doSubmit();
        e.preventDefault();
      }}
    >
      <Input autoFocus value={value} onValueChange={setValue} />
      <Button onPress={doSubmit}>OK</Button>
    </form>
  );
}
