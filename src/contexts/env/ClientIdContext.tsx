import { createContext, ReactNode, useMemo } from 'react';

export interface ClientIdContextValue {
  readonly clientId: string;
}

export const ClientIdContext = createContext<ClientIdContextValue>({
  clientId: '',
});

interface ClientIdContextProviderProps {
  clientId: string;
  children: ReactNode;
}

export function ClientIdContextProvider({
  clientId,
  children,
}: ClientIdContextProviderProps) {
  const value: ClientIdContextValue = useMemo(() => ({ clientId }), [clientId]);
  return (
    <ClientIdContext.Provider value={value}>
      {children}
    </ClientIdContext.Provider>
  );
}
