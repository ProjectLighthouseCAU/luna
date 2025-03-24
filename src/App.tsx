import { AuthContextProvider } from '@luna/contexts/api/auth/AuthContext';
import { ColorSchemeContextProvider } from '@luna/contexts/env/ColorSchemeContext';
import { ModelContextProvider } from '@luna/contexts/api/model/ModelContext';
import { DisplaySearchContextProvider } from '@luna/contexts/displays/DisplaySearchContext';
import { WindowDimensionsContextProvider } from '@luna/contexts/env/WindowDimensionsContext';
import { router } from '@luna/routes';
import { HeroUIProvider } from '@heroui/react';
import { RouterProvider } from 'react-router-dom';
import { ClientIdContextProvider } from '@luna/contexts/env/ClientIdContext';
import { UserPinsContextProvider } from '@luna/contexts/displays/UserPinsContext';
import { randomUUID } from '@luna/utils/uuid';

const clientId = randomUUID();

export function App() {
  return (
    <HeroUIProvider>
      <ClientIdContextProvider clientId={clientId}>
        <ColorSchemeContextProvider>
          <WindowDimensionsContextProvider>
            <AuthContextProvider>
              <ModelContextProvider>
                <UserPinsContextProvider>
                  <DisplaySearchContextProvider>
                    <RouterProvider router={router} />
                  </DisplaySearchContextProvider>
                </UserPinsContextProvider>
              </ModelContextProvider>
            </AuthContextProvider>
          </WindowDimensionsContextProvider>
        </ColorSchemeContextProvider>
      </ClientIdContextProvider>
    </HeroUIProvider>
  );
}
