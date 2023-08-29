import { Input } from '@nextui-org/react';
import { IconSearch } from '@tabler/icons-react';
import { useCallback } from 'react';

export interface SearchBarProps {
  placeholder?: string;
  query: string;
  setQuery: (query: string) => void;
}

export function SearchBar({ placeholder, query, setQuery }: SearchBarProps) {
  const clearQuery = useCallback(() => setQuery(''), [setQuery]);

  return (
    <Input
      startContent={<IconSearch />}
      placeholder={placeholder}
      value={query}
      onValueChange={setQuery}
      onClear={clearQuery}
    />
  );
}
