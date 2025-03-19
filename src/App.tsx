import { AuthContextProvider } from '@luna/contexts/api/auth/AuthContext';
import { ColorSchemeContextProvider } from '@luna/contexts/env/ColorSchemeContext';
import { ModelContextProvider } from '@luna/contexts/api/model/ModelContext';
import { SearchContextProvider } from '@luna/contexts/displays/SearchContext';
import { WindowDimensionsContextProvider } from '@luna/contexts/env/WindowDimensionsContext';
import { router } from '@luna/routes';
import { HeroUIProvider } from '@heroui/react';
import { RouterProvider } from 'react-router-dom';
import { ClientIdContextProvider } from '@luna/contexts/env/ClientIdContext';
import { UserPinsContextProvider } from '@luna/contexts/displays/UserPinsContext';

const clientId = crypto.randomUUID();

export function App() {
  return (
    <HeroUIProvider>
      <ClientIdContextProvider clientId={clientId}>
        <ColorSchemeContextProvider>
          <WindowDimensionsContextProvider>
            <AuthContextProvider>
              <ModelContextProvider>
                <UserPinsContextProvider>
                  <SearchContextProvider>
                    <RouterProvider router={router} />
                  </SearchContextProvider>
                </UserPinsContextProvider>
              </ModelContextProvider>
            </AuthContextProvider>
          </WindowDimensionsContextProvider>
        </ColorSchemeContextProvider>
      </ClientIdContextProvider>
    </HeroUIProvider>
  );
}
