import { Input, Tooltip } from '@nextui-org/react';
import { ReactNode, useCallback } from 'react';

export interface FormInputProps {
  label: string;
  type?: string;
  tooltip?: string;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  setValue?: (value: string) => void;
  resetError?: () => void;
}

export function FormInput({
  label,
  type,
  tooltip,
  isInvalid,
  errorMessage,
  setValue,
  resetError,
}: FormInputProps) {
  const onValueChange = useCallback(
    (value: string) => {
      setValue?.(value);
      resetError?.();
    },
    [setValue, resetError]
  );

  const input = (
    <Input
      size="sm"
      label={label}
      aria-label={label}
      type={type}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      onValueChange={onValueChange}
    />
  );

  return tooltip ? (
    <Tooltip placement="right" content={tooltip}>
      {input}
    </Tooltip>
  ) : (
    input
  );
}
