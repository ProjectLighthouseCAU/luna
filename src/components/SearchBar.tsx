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
  setQuery: (query: string) => void;
}

export function SearchBar({
  placeholder,
  fullWidth,
  className = '',
  tooltip,
  tooltipPlacement,
  setQuery,
}: SearchBarProps) {
  const [value, setValue] = useState('');

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
    <Input
      startContent={<IconSearch />}
      placeholder={placeholder}
      value={value}
      fullWidth
      onValueChange={onValueChange}
      onClear={clearQuery}
    />
  );

  return tooltip ? (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      {input}
    </Tooltip>
  ) : (
    input
  );
}
