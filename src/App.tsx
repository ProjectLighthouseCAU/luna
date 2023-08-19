import { AppContainer } from '@luna/AppContainer';
import { AuthContextProvider } from '@luna/contexts/AuthContext';
import { ColorSchemeContextProvider } from '@luna/contexts/ColorSchemeContext';
import { ModelContextProvider } from '@luna/contexts/ModelContext';
import { WindowDimensionsContextProvider } from '@luna/contexts/WindowDimensionsContext';
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <NextUIProvider>
      <ColorSchemeContextProvider>
        <WindowDimensionsContextProvider>
          <AuthContextProvider>
            <ModelContextProvider>
              <BrowserRouter>
                <AppContainer />
              </BrowserRouter>
            </ModelContextProvider>
          </AuthContextProvider>
        </WindowDimensionsContextProvider>
      </ColorSchemeContextProvider>
    </NextUIProvider>
  );
}
