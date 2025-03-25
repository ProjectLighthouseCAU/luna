import { useDebounce } from '@luna/hooks/useDebounce';
import { Input, Tooltip } from '@heroui/react';
import { IconSearch } from '@tabler/icons-react';
import { ReactNode, useCallback, useState } from 'react';

export interface SearchBarProps {
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  tooltip?: ReactNode;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  initialQuery?: string;
  setQuery: (query: string) => void;
}

export function SearchBar({
  placeholder,
  fullWidth,
  className = '',
  tooltip,
  tooltipPlacement,
  initialQuery = '',
  setQuery,
}: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);

  const setQueryDebounced = useDebounce(setQuery, 200);

  const onValueChange = useCallback(
    (value: string) => {
      setValue(value);
      setQueryDebounced(value);
    },
    [setQueryDebounced]
  );

  const clearQuery = useCallback(() => onValueChange(''), [onValueChange]);

  const input = (
    <div className={`${fullWidth ? '' : 'max-w-60'} ${className}`}>
      <Input
        startContent={<IconSearch />}
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
        onClear={clearQuery}
      />
    </div>
  );

  return (
    <Tooltip
      content={tooltip}
      placement={tooltipPlacement}
      isDisabled={tooltip === undefined}
    >
      {input}
    </Tooltip>
  );
}
