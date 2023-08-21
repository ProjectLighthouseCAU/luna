import { AppContainer } from '@luna/AppContainer';
import { adminRoute } from '@luna/routes/admin';
import { displaysRoute } from '@luna/routes/displays';
import { RootScreen } from '@luna/screens/root/RootScreen';
import { RouteObject, createBrowserRouter } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    element: <AppContainer />,
    children: [
      {
        path: '/',
        element: <RootScreen />,
        children: [adminRoute, displaysRoute],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
