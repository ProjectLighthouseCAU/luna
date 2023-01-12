import { AppContainer } from '@luna/AppContainer';
import { WindowDimensionsContextProvider } from '@luna/contexts/WindowDimensions';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';

const lightTheme = createTheme({
  type: 'light',
});

const darkTheme = createTheme({
  type: 'dark',
});

export function App() {
  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{ light: lightTheme.className, dark: darkTheme.className }}
    >
      <NextUIProvider>
        <WindowDimensionsContextProvider>
          <AppContainer />
        </WindowDimensionsContextProvider>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
