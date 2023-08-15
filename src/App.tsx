import { AppContainer } from '@luna/AppContainer';
import { AuthContextProvider } from '@luna/contexts/AuthContext';
import { WindowDimensionsContextProvider } from '@luna/contexts/WindowDimensionsContext';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      primaryBorder: '#FF0000',
      backgroundContrast: '#151515', // e.g. card backgrounds
      accents0: '#252525', // e.g. input backgrounds
      selection: '#3C009C',
    },
  },
});

export function App() {
  return (
    <NextUIProvider theme={darkTheme}>
      <WindowDimensionsContextProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <AppContainer />
          </BrowserRouter>
        </AuthContextProvider>
      </WindowDimensionsContextProvider>
    </NextUIProvider>
  );
}
