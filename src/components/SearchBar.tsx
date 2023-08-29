import { debounce } from '@luna/utils/schedule';
import { Input } from '@nextui-org/react';
import { IconSearch } from '@tabler/icons-react';
import { useCallback, useMemo, useState } from 'react';

export interface SearchBarProps {
  placeholder?: string;
  setQuery: (query: string) => void;
}

export function SearchBar({ placeholder, setQuery }: SearchBarProps) {
  const [value, setValue] = useState('');

  const setQueryDebounced = useMemo(
    () =>
      debounce((query: string) => {
        setQuery(query);
      }, 200),
    [setQuery]
  );

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
      value={value}
      onValueChange={onValueChange}
      onClear={clearQuery}
    />
  );
}
