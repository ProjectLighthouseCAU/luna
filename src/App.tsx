import { AppContainer } from '@luna/AppContainer';
import { AuthContextProvider } from '@luna/contexts/AuthContext';
import { WindowDimensionsContextProvider } from '@luna/contexts/WindowDimensionsContext';
import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <NextUIProvider>
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
