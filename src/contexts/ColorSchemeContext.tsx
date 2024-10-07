import { ReactNode, createContext, useEffect, useState } from 'react';

interface ColorScheme {
  readonly isDark: boolean;
}

export type ColorSchemeContextValue = ColorScheme;

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  isDark: false,
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

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      {children}
    </ColorSchemeContext.Provider>
  );
}
