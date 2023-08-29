import { UnderConstruction } from '@luna/components/UnderConstruction';
import { AdminView } from '@luna/screens/home/admin/AdminView';
import { MonitorView } from '@luna/screens/home/admin/MonitorView';
import { UsersView } from '@luna/screens/home/admin/UsersView';
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
      element: <MonitorView />,
      children: [],
    },
    {
      path: 'users',
      element: <UsersView />,
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
