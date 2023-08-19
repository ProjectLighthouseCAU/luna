import { AuthContextProvider } from '@luna/contexts/AuthContext';
import { ColorSchemeContextProvider } from '@luna/contexts/ColorSchemeContext';
import { ModelContextProvider } from '@luna/contexts/ModelContext';
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
              <RouterProvider router={router} />
            </ModelContextProvider>
          </AuthContextProvider>
        </WindowDimensionsContextProvider>
      </ColorSchemeContextProvider>
    </NextUIProvider>
  );
}
