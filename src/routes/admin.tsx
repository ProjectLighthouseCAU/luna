import { UnderConstruction } from '@luna/components/UnderConstruction';
import { AdminView } from '@luna/screens/home/admin/AdminView';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { RouteObject } from 'react-router-dom';

export const adminRoute: RouteObject = {
  path: 'admin',
  children: [
    {
      index: true,
      element: <AdminView />,
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
};
