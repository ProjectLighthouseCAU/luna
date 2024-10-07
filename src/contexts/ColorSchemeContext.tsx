import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
} from 'react';

interface ColorScheme {
  readonly isDark: boolean;
}

function systemDarkQuery(): MediaQueryList {
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function systemColorScheme(): ColorScheme {
  const query = systemDarkQuery();
  return { isDark: query.matches };
}

export interface ColorSchemeContextValue {
  readonly colorScheme: ColorScheme;
  setColorScheme: Dispatch<SetStateAction<ColorScheme>>;
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  colorScheme: { isDark: false },
  setColorScheme() {},
});

interface ColorSchemeContextProviderProps {
  children: ReactNode;
}

export function ColorSchemeContextProvider({
  children,
}: ColorSchemeContextProviderProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
    LocalStorageKey.ColorScheme,
    systemColorScheme
  );

  useEffect(() => {
    systemDarkQuery().addEventListener('change', () => {
      setColorScheme(systemColorScheme());
    });
  }, [setColorScheme]);

  const value: ColorSchemeContextValue = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
    }),
    [colorScheme, setColorScheme]
  );

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
}
