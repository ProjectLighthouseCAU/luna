import { AuthClient } from '@luna/client/auth/AuthClient';
import { LegacyAuthClient } from '@luna/client/auth/LegacyAuthClient';
import { NullAuthClient } from '@luna/client/auth/NullAuthClient';
import { Token } from '@luna/client/auth/Token';
import { useInitRef } from '@luna/hooks/useInitRef';
import React, { createContext, ReactNode, useRef, useState } from 'react';

export interface Auth {
  /** The username of the authenticated user. */
  readonly username: string | null;

  /** The client used to perform requests. */
  readonly client: AuthClient;
}

export const AuthContext = createContext<Auth>({
  username: null,
  client: new NullAuthClient(),
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [username, setUsername] = useState<string | null>(null);
  const tokenRef = useRef<Token | null>(null);
  // TODO: This currently requires using a local CORS proxy on port 8010
  // since the legacy backend does not allow CORS origins.
  // (e.g. `npm i -g local-cors-proxy && lcp --proxyUrl https://lighthouse.uni-kiel.de --proxyPartial / --credentials --origin http://localhost:3000`)
  const clientRef = useInitRef<AuthClient>(
    () => new LegacyAuthClient('http://localhost:8010')
  );

  // TODO: Deal with case-sensitivity, what if the user logs in with a different casing?

  const wrapperClient: AuthClient = {
    async logIn(username, password) {
      if (await clientRef.current.logIn(username, password)) {
        setUsername(username);
        return true;
      }
      return false;
    },

    async logOut() {
      if (await clientRef.current.logOut()) {
        setUsername(null);
        return true;
      }
      return false;
    },

    async getPublicUsers() {
      return await clientRef.current.getPublicUsers();
    },

    async getToken() {
      if (tokenRef.current === null) {
        tokenRef.current = await clientRef.current.getToken();
      }
      return tokenRef.current;
    },
  };

  return (
    <AuthContext.Provider value={{ username, client: wrapperClient }}>
      {children}
    </AuthContext.Provider>
  );
}
