import { ReactNode, createContext, useState } from 'react';

export interface DisplaySearchContextValue {
  query: string;
  setQuery: (query: string) => void;
}

export const DisplaySearchContext = createContext<DisplaySearchContextValue>({
  query: '',
  setQuery: () => {},
});

interface DisplaySearchContextProviderProps {
  children: ReactNode;
}

export function DisplaySearchContextProvider({
  children,
}: DisplaySearchContextProviderProps) {
  const [query, setQuery] = useState('');
  return (
    <DisplaySearchContext.Provider value={{ query, setQuery }}>
      {children}
    </DisplaySearchContext.Provider>
  );
}
