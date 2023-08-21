import { UnderConstruction } from '@luna/components/UnderConstruction';
import { Admin } from '@luna/screens/home/admin/Admin';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { RouteObject } from 'react-router-dom';

export const adminRoute: RouteObject = {
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
};
