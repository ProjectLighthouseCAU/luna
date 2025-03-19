import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ColorScheme {
  readonly isDark: boolean;
}

function systemDarkModeQuery(): MediaQueryList {
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function currentSystemColorScheme(): ColorScheme {
  const query = systemDarkModeQuery();
  return { isDark: query.matches };
}

export interface ColorSchemeContextValue {
  readonly colorScheme: ColorScheme;
  readonly followsSystem: boolean;
  setColorScheme: Dispatch<SetStateAction<ColorScheme>>;
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  colorScheme: { isDark: false },
  followsSystem: true,
  setColorScheme() {},
});

interface ColorSchemeContextProviderProps {
  children: ReactNode;
}

export function ColorSchemeContextProvider({
  children,
}: ColorSchemeContextProviderProps) {
  const [systemColorScheme, setSystemColorScheme] = useState<ColorScheme>(
    currentSystemColorScheme()
  );

  useEffect(() => {
    systemDarkModeQuery().addEventListener('change', () => {
      setSystemColorScheme(currentSystemColorScheme());
    });
  }, []);

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
    LocalStorageKey.ColorScheme,
    () => systemColorScheme
  );

  const [followsSystem, setFollowsSystem] = useLocalStorage<boolean>(
    LocalStorageKey.ColorSchemeFollowsSystem,
    () => true
  );

  useEffect(() => {
    setFollowsSystem(colorScheme.isDark === systemColorScheme.isDark);
  }, [colorScheme, systemColorScheme, setFollowsSystem]);

  useEffect(() => {
    if (followsSystem) {
      setColorScheme(systemColorScheme);
    }
  }, [followsSystem, systemColorScheme, setColorScheme]);

  const value: ColorSchemeContextValue = useMemo(
    () => ({
      colorScheme,
      followsSystem,
      setColorScheme,
    }),
    [colorScheme, followsSystem, setColorScheme]
  );

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
}
