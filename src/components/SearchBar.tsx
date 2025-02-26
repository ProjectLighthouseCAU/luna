import { useDebounce } from '@luna/hooks/useDebounce';
import { Input } from '@heroui/react';
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
    // TODO: Pass fullWidth directly to <Input> once https://github.com/nextui-org/nextui/pull/3768 is released
    (<div className={fullWidth ? '' : 'max-w-60'}>
      <Input
        startContent={<IconSearch />}
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
        onClear={clearQuery}
      />
    </div>)
  );
}
