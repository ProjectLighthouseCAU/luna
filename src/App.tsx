import React from 'react';
import { AppContainer } from './AppContainer';
import { WindowDimensionsContextProvider } from './contexts/WindowDimensionsContext';

export function App() {
  return (
    <WindowDimensionsContextProvider>
      <AppContainer />
    </WindowDimensionsContextProvider>
  );
}
