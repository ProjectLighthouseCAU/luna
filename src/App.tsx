import { AuthContextProvider } from '@luna/contexts/api/auth/AuthContext';
import { ColorSchemeContextProvider } from '@luna/contexts/env/ColorSchemeContext';
import { ModelContextProvider } from '@luna/contexts/api/model/ModelContext';
import { SearchContextProvider } from '@luna/contexts/filter/SearchContext';
import { WindowDimensionsContextProvider } from '@luna/contexts/env/WindowDimensionsContext';
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
