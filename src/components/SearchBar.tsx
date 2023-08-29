import { Input } from '@nextui-org/react';
import { IconSearch } from '@tabler/icons-react';

export interface SearchBarProps {
  placeholder?: string;
  query: string;
  setQuery: (query: string) => void;
}

export function SearchBar({ placeholder, query, setQuery }: SearchBarProps) {
  return (
    <Input
      startContent={<IconSearch />}
      placeholder={placeholder}
      value={query}
      onValueChange={setQuery}
    />
  );
}
