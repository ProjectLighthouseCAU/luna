import { useDebounce } from '@luna/hooks/useDebounce';
import { Input } from '@nextui-org/react';
import { IconSearch } from '@tabler/icons-react';
import { useCallback, useState } from 'react';

export interface SearchBarProps {
  placeholder?: string;
  fullWidth?: boolean;
  setQuery: (query: string) => void;
}

export function SearchBar({
  placeholder,
  fullWidth,
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

  return (
    <Input
      startContent={<IconSearch />}
      placeholder={placeholder}
      fullWidth={fullWidth}
      value={value}
      onValueChange={onValueChange}
      onClear={clearQuery}
    />
  );
}
