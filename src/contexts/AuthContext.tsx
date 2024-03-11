import { AuthClient } from '@luna/client/auth/AuthClient';
import { LegacyAuthClient } from '@luna/client/auth/LegacyAuthClient';
import { NullAuthClient } from '@luna/client/auth/NullAuthClient';
import { Token } from '@luna/client/auth/Token';
import { User } from '@luna/client/auth/User';
import { useInitRef } from '@luna/hooks/useInitRef';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export interface Auth {
  /** Whether auth is still initializing. */
  readonly isInitializing: boolean;

  /** The authenticated user. */
  readonly user: User | null;

  /** The current token. */
  readonly token: Token | null;

  /** The client used to perform requests. */
  readonly client: AuthClient;
}

export const AuthContext = createContext<Auth>({
  isInitializing: true,
  user: null,
  token: null,
  client: new NullAuthClient(),
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isInitializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<Token | null>(null);
  // TODO: This currently requires using a local CORS proxy on port 8010
  // since the legacy backend does not allow CORS origins. To run it,
  // use `npm run cors-proxy`.
  const clientRef = useInitRef<AuthClient>(
    () => new LegacyAuthClient(`http://${window.location.hostname}:8010`)
  );

  // TODO: Deal with case-sensitivity, what if the user logs in with a different casing?

  const wrapperClient = useInitRef<AuthClient>(() => ({
    async signUp(registrationKey, username, password) {
      const user = await clientRef.current.signUp(
        registrationKey,
        username,
        password
      );
      if (user !== null) {
        setUser(user);
        setToken(await this.getToken());
      }
      return user;
    },

    async logIn(username, password) {
      const user = await clientRef.current.logIn(username, password);
      if (user !== null) {
        setUser(user);
        setToken(await this.getToken());
      }
      return user;
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

    async getToken() {
      return await clientRef.current.getToken();
    },
  }));

  useEffect(() => {
    (async () => {
      if (isInitializing) {
        await wrapperClient.current.logIn();
        setInitializing(false);
      }
    })();
  }, [isInitializing, wrapperClient]);

  return (
    <AuthContext.Provider
      value={{ isInitializing, user, token, client: wrapperClient.current }}
    >
      {children}
    </AuthContext.Provider>
  );
}
