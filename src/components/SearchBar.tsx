import { Input } from '@nextui-org/react';
import { IconSearch } from '@tabler/icons-react';
import { useCallback } from 'react';
import { unstable_next } from 'scheduler';

export interface SearchBarProps {
  placeholder?: string;
  query: string;
  setQuery: (query: string) => void;
}

export function SearchBar({ placeholder, query, setQuery }: SearchBarProps) {
  const clearQuery = useCallback(() => setQuery(''), [setQuery]);

  const onValueChange = useCallback(
    (query: string) => {
      unstable_next(() => setQuery(query));
    },
    [setQuery]
  );

  return (
    <Input
      startContent={<IconSearch />}
      placeholder={placeholder}
      value={query}
      onValueChange={onValueChange}
      onClear={clearQuery}
    />
  );
}
