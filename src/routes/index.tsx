import { AppContainer } from '@luna/AppContainer';
import { adminRoute } from '@luna/routes/admin';
import { displaysRoute } from '@luna/routes/displays';
import { NotFoundScreen } from '@luna/screens/notfound/NotFoundScreen';
import { RootScreen } from '@luna/screens/root/RootScreen';
import {
  RouteObject,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom';

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

// When building for relative hosting (e.g. for Electron like in LUNA Desktop)
// we use a HashRouter which does not make any assumptions about the hosting
// path.

export const router = process.env.PUBLIC_URL.startsWith('.')
  ? createHashRouter(routes)
  : createBrowserRouter(routes);
