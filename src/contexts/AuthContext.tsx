import { AuthClient } from '@luna/client/auth/AuthClient';
import { LegacyAuthClient } from '@luna/client/auth/LegacyAuthClient';
import { NullAuthClient } from '@luna/client/auth/NullAuthClient';
import { Token } from '@luna/client/auth/Token';
import { User } from '@luna/client/auth/User';
import { useInitRef } from '@luna/hooks/useInitRef';
import React, { createContext, ReactNode, useState } from 'react';

export interface Auth {
  /** The authenticated user. */
  readonly user: User | null;

  /** The current token. */
  readonly token: Token | null;

  /** The client used to perform requests. */
  readonly client: AuthClient;
}

export const AuthContext = createContext<Auth>({
  user: null,
  token: null,
  client: new NullAuthClient(),
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<Token | null>(null);
  // TODO: This currently requires using a local CORS proxy on port 8010
  // since the legacy backend does not allow CORS origins. To run it,
  // use `npm run cors-proxy`.
  const clientRef = useInitRef<AuthClient>(
    () => new LegacyAuthClient(`http://${window.location.hostname}:8010`)
  );

  // TODO: Deal with case-sensitivity, what if the user logs in with a different casing?

  const wrapperClient: AuthClient = {
    async signUp(registrationKey, username, password) {
      if (await clientRef.current.signUp(registrationKey, username, password)) {
        setUser(await this.getUser());
        setToken(await this.getToken());
        return true;
      }
      return false;
    },

    async logIn(username, password) {
      if (await clientRef.current.logIn(username, password)) {
        setUser(await this.getUser());
        setToken(await this.getToken());
        return true;
      }
      return false;
    },

    async logOut() {
      if (await clientRef.current.logOut()) {
        setUser(null);
        return true;
      }
      return false;
    },

    async getPublicUsers() {
      return await clientRef.current.getPublicUsers();
    },

    async getAllUsers() {
      return await clientRef.current.getAllUsers();
    },

    async getUser() {
      return await clientRef.current.getUser();
    },

    async getToken() {
      return await clientRef.current.getToken();
    },
  };

  return (
    <AuthContext.Provider value={{ user, token, client: wrapperClient }}>
      {children}
    </AuthContext.Provider>
  );
}
