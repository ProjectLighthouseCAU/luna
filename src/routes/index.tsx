import { AppContainer } from '@luna/AppContainer';
import { UnderConstruction } from '@luna/components/UnderConstruction';
import { Admin } from '@luna/screens/home/Admin';
import { Displays } from '@luna/screens/home/Displays';
import { HomeTitled } from '@luna/screens/home/HomeTitled';
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
                  <HomeTitled title="Admin">
                    <Admin />
                  </HomeTitled>
                ),
              },
              {
                path: 'monitor',
                element: (
                  <HomeTitled title="Monitor">
                    <UnderConstruction />
                  </HomeTitled>
                ),
                children: [],
              },
              {
                path: 'settings',
                element: (
                  <HomeTitled title="Settings">
                    <UnderConstruction />
                  </HomeTitled>
                ),
              },
            ],
          },
          {
            path: 'displays',
            element: (
              <HomeTitled title="Displays">
                <Displays />
              </HomeTitled>
            ),
            children: [],
          },
        ],
      },
    ],
  },
]);
