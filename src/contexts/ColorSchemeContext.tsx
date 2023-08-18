import { ReactNode, createContext, useEffect, useState } from 'react';

export interface ColorScheme {
  readonly isDark: boolean;
}

export const ColorSchemeContext = createContext<ColorScheme>({
  isDark: false,
});

interface ColorSchemeContextProps {
  children: ReactNode;
}

export function ColorSchemeContextProvider({
  children,
}: ColorSchemeContextProps) {
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
