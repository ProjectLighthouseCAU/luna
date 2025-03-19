import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { Set } from 'immutable';
import { ReactNode, createContext, useMemo } from 'react';

export interface UserPinsContextValue {
  pinnedUsernames: Set<string>;
  setPinnedUsernames: (newPinned: Set<string>) => void;
}

export const UserPinsContext = createContext<UserPinsContextValue>({
  pinnedUsernames: Set(),
  setPinnedUsernames: () => {},
});

interface UserPinsContextProviderProps {
  children: ReactNode;
}

export function UserPinsContextProvider({
  children,
}: UserPinsContextProviderProps) {
  const [pinnedUsernames, setPinnedUsernames] = useLocalStorage<string[]>(
    LocalStorageKey.UserPins,
    () => []
  );

  const value = useMemo<UserPinsContextValue>(
    () => ({
      pinnedUsernames: Set(pinnedUsernames),
      setPinnedUsernames(newPinned) {
        setPinnedUsernames([...newPinned]);
      },
    }),
    [pinnedUsernames, setPinnedUsernames]
  );

  return (
    <UserPinsContext.Provider value={value}>
      {children}
    </UserPinsContext.Provider>
  );
}
