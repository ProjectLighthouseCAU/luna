import { AuthClient } from '@luna/client/auth/AuthClient';
import { LegacyAuthClient } from '@luna/client/auth/LegacyAuthClient';
import { NullAuthClient } from '@luna/client/auth/NullAuthClient';
import { useInitRef } from '@luna/hooks/useInitRef';
import React, { createContext, ReactNode, useState } from 'react';

export interface Auth {
  /** The username of the authenticated user. */
  readonly username?: string;

  /** The client used to perform requests. */
  readonly client: AuthClient;
}

export const AuthContext = createContext<Auth>({
  client: new NullAuthClient(),
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [username, setUsername] = useState<string>();
  const clientRef = useInitRef(() => new LegacyAuthClient());

  const wrapperClient: AuthClient = {
    login(username, password) {
      setUsername(username);
      clientRef.current.login(username, password);
    },

    getPublicUsers() {
      return clientRef.current.getPublicUsers();
    },
  };

  return (
    <AuthContext.Provider value={{ username, client: wrapperClient }}>
      {children}
    </AuthContext.Provider>
  );
}
