import { AppContainer } from '@luna/AppContainer';
import { UnderConstruction } from '@luna/components/UnderConstruction';
import { Admin } from '@luna/screens/home/Admin';
import { Displays } from '@luna/screens/home/Displays';
import { HomeScreen } from '@luna/screens/home/HomeScreen';
import { Titled } from '@luna/screens/home/Titled';
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
              <Titled title="Admin">
                <Admin />
              </Titled>
            ),
            children: [
              {
                path: 'monitor',
                element: (
                  <Titled title="Monitor">
                    <UnderConstruction />
                  </Titled>
                ),
                children: [],
              },
              {
                path: 'settings',
                element: (
                  <Titled title="Settings">
                    <UnderConstruction />
                  </Titled>
                ),
              },
            ],
          },
          {
            path: 'displays',
            element: (
              <Titled title="Displays">
                <Displays />
              </Titled>
            ),
            children: [],
          },
        ],
      },
    ],
  },
]);
