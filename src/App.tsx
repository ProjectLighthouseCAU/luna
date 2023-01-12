import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { AppContainer } from './AppContainer';
import { WindowDimensionsContextProvider } from './contexts/WindowDimensions';

export function App() {
  return (
    <NextUIProvider>
      <WindowDimensionsContextProvider>
        <AppContainer />
      </WindowDimensionsContextProvider>
    </NextUIProvider>
  );
}
