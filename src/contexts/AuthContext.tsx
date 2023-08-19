import React, { createContext, ReactNode, useState } from 'react';

export interface Auth {
  token?: string;
  setToken: (token?: string) => void;
}

export const AuthContext = createContext<Auth>({
  setToken: () => {},
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [token, setToken] = useState<string>();

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
