import { AppContainer } from '@luna/AppContainer';
import { UnderConstruction } from '@luna/components/UnderConstruction';
import { Admin } from '@luna/screens/home/Admin';
import { Displays } from '@luna/screens/home/Displays';
import { HomeScreen } from '@luna/screens/home/HomeScreen';
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
            element: <Admin />,
            children: [
              {
                path: 'monitor',
                element: <UnderConstruction />,
                children: [],
              },
              {
                path: 'settings',
                element: <UnderConstruction />,
              },
            ],
          },
          {
            path: 'displays',
            element: <Displays />,
            children: [],
          },
        ],
      },
    ],
  },
]);
