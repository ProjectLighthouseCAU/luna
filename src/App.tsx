import { AuthContextProvider } from '@luna/contexts/api/auth/AuthContext';
import { ColorSchemeContextProvider } from '@luna/contexts/env/ColorSchemeContext';
import { ModelContextProvider } from '@luna/contexts/api/model/ModelContext';
import { SearchContextProvider } from '@luna/contexts/filter/SearchContext';
import { WindowDimensionsContextProvider } from '@luna/contexts/env/WindowDimensionsContext';
import { router } from '@luna/routes';
import { HeroUIProvider } from '@heroui/react';
import { RouterProvider } from 'react-router-dom';

export function App() {
  return (
    <HeroUIProvider>
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
    </HeroUIProvider>
  );
}
