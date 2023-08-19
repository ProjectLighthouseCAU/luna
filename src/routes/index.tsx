import { AppContainer } from '@luna/AppContainer';
import { UnderConstruction } from '@luna/components/UnderConstruction';
import { Admin } from '@luna/screens/home/Admin';
import { Displays } from '@luna/screens/home/Displays';
import { HomeScreen } from '@luna/screens/home/HomeScreen';
import { HomeTitled } from '@luna/screens/home/HomeTitled';
import { LoginScreen } from '@luna/screens/login/LoginScreen';
import { RootScreen } from '@luna/screens/root/RootScreen';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <AppContainer />,
    children: [
      {
        path: '/',
        element: <RootScreen />,
      },
      {
        path: '/login',
        element: <LoginScreen />,
      },
      {
        path: '/home',
        element: <HomeScreen />,
        children: [
          {
            path: 'admin',
            element: (
              <HomeTitled title="Admin">
                <Admin />
              </HomeTitled>
            ),
            children: [
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
