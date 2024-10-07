import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';

interface ColorScheme {
  readonly isDark: boolean;
}

export interface ColorSchemeContextValue {
  readonly colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
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
  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    isDark: false,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme({ isDark: mediaQuery.matches });
    mediaQuery.addEventListener('change', () => {
      setColorScheme({ isDark: mediaQuery.matches });
    });
  }, []);

  const value: ColorSchemeContextValue = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
    }),
    [colorScheme]
  );

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
}
