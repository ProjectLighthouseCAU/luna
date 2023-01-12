import { AppContainer } from '@luna/AppContainer';
import { WindowDimensionsContextProvider } from '@luna/contexts/WindowDimensions';
import { NextUIProvider } from '@nextui-org/react';
import React from 'react';

export function App() {
  return (
    <NextUIProvider>
      <WindowDimensionsContextProvider>
        <AppContainer />
      </WindowDimensionsContextProvider>
    </NextUIProvider>
  );
}
