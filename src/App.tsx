import { AuthContextProvider } from '@luna/contexts/AuthContext';
import { ColorSchemeContextProvider } from '@luna/contexts/ColorSchemeContext';
import { ModelContextProvider } from '@luna/contexts/ModelContext';
import { SearchContextProvider } from '@luna/contexts/SearchContext';
import { WindowDimensionsContextProvider } from '@luna/contexts/WindowDimensionsContext';
import { router } from '@luna/routes';
import { NextUIProvider } from '@nextui-org/react';
import { RouterProvider } from 'react-router-dom';

export function App() {
  return (
    <NextUIProvider>
      <ColorSchemeContextProvider>
        <WindowDimensionsContextProvider>
          <AuthContextProvider>
            <ModelContextProvider>
              <SearchContextProvider>
                <RouterProvider router={router} />
              </SearchContextProvider>
            </ModelContextProvider>
          </AuthContextProvider>
        </WindowDimensionsContextProvider>
      </ColorSchemeContextProvider>
    </NextUIProvider>
  );
}
