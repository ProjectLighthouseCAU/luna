import { AppContainer } from '@luna/AppContainer';
import { UnderConstruction } from '@luna/components/UnderConstruction';
import { Admin } from '@luna/screens/home/Admin';
import { Displays } from '@luna/screens/home/Displays';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { RootScreen } from '@luna/screens/root/RootScreen';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <AppContainer />,
    children: [
      {
        path: '/',
        element: <RootScreen />,
        children: [
          {
            path: 'admin',
            children: [
              {
                index: true,
                element: (
                  <HomeContent title="Admin">
                    <Admin />
                  </HomeContent>
                ),
              },
              {
                path: 'monitor',
                element: (
                  <HomeContent title="Monitor">
                    <UnderConstruction />
                  </HomeContent>
                ),
                children: [],
              },
              {
                path: 'settings',
                element: (
                  <HomeContent title="Settings">
                    <UnderConstruction />
                  </HomeContent>
                ),
              },
            ],
          },
          {
            path: 'displays',
            element: (
              <HomeContent title="Displays">
                <Displays />
              </HomeContent>
            ),
          },
        ],
      },
    ],
  },
]);
