import { ReactNode, createContext, useState } from 'react';

export interface Search {
  query: string;
  setQuery: (query: string) => void;
}

export const SearchContext = createContext<Search>({
  query: '',
  setQuery: () => {},
});

interface SearchContextProviderProps {
  children: ReactNode;
}

export function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  const [query, setQuery] = useState('');
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
