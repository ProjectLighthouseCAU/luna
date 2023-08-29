import { AppContainer } from '@luna/AppContainer';
import { adminRoute } from '@luna/routes/admin';
import { displaysRoute } from '@luna/routes/displays';
import { NotFoundScreen } from '@luna/screens/notfound/NotFoundScreen';
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
      {
        path: '*',
        element: <NotFoundScreen />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
