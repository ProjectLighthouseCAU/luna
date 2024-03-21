import { AuthService } from '@luna/services/auth/AuthService';
import { LegacyAuthService } from '@luna/services/auth/LegacyAuthService';
import { MockAuthService } from '@luna/services/auth/MockAuthService';
import { NullAuthService } from '@luna/services/auth/NullAuthService';
import { Token } from '@luna/services/auth/Token';
import { User } from '@luna/services/auth/User';
import { useInitRef } from '@luna/hooks/useInitRef';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export interface Auth {
  /** Whether auth is still initializing. */
  readonly isInitializing: boolean;

  /** The authenticated user. */
  readonly user: User | null;

  /** The current token. */
  readonly token: Token | null;

  /** The service to perform requests. */
  readonly service: AuthService;
}

export const AuthContext = createContext<Auth>({
  isInitializing: true,
  user: null,
  token: null,
  service: new NullAuthService(),
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isInitializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<Token | null>(null);

  const serviceRef = useInitRef<AuthService>(() => {
    const authType = process.env.REACT_APP_AUTH_TYPE;
    switch (authType) {
      case 'legacy':
        return new LegacyAuthService(process.env.REACT_APP_AUTH_SERVER_URL);
      case 'mock':
        return new MockAuthService();
      case 'null':
        return new NullAuthService();
      default:
        throw new Error(
          `Could not instantiate unknown auth type '${authType}'`
        );
    }
  });

  // TODO: Deal with case-sensitivity, what if the user logs in with a different casing?

  const wrapperRef = useInitRef<AuthService>(() => ({
    async signUp(registrationKey, username, password) {
      const user = await serviceRef.current.signUp(
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
      const user = await serviceRef.current.logIn(username, password);
      if (user !== null) {
        setUser(user);
        setToken(await this.getToken());
      }
      return user;
    },

    async logOut() {
      if (await serviceRef.current.logOut()) {
        setUser(null);
        return true;
      }
      return false;
    },

    async getPublicUsers() {
      return await serviceRef.current.getPublicUsers();
    },

    async getAllUsers() {
      return await serviceRef.current.getAllUsers();
    },

    async getToken() {
      return await serviceRef.current.getToken();
    },
  }));

  useEffect(() => {
    (async () => {
      if (isInitializing) {
        await wrapperRef.current.logIn();
        setInitializing(false);
      }
    })();
  }, [isInitializing, wrapperRef]);

  return (
    <AuthContext.Provider
      value={{ isInitializing, user, token, service: wrapperRef.current }}
    >
      {children}
    </AuthContext.Provider>
  );
}
