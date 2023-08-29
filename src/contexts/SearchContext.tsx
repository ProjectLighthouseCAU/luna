import { ReactNode, createContext } from 'react';

export interface Search {
  query: string;
}

export const SearchContext = createContext<Search>({
  query: '',
});

interface SearchContextProviderProps {
  query: string;
  children: ReactNode;
}

export function SearchContextProvider({
  query,
  children,
}: SearchContextProviderProps) {
  return (
    <SearchContext.Provider value={{ query }}>
      {children}
    </SearchContext.Provider>
  );
}
