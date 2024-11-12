import { AdminView } from '@luna/screens/home/admin/AdminView';
import { MonitorView } from '@luna/screens/home/admin/MonitorView';
import { RegistrationKeysView } from '@luna/screens/home/admin/RegistrationKeysView';
import { ResourcesView } from '@luna/screens/home/admin/ResourcesView';
import { RolesView } from '@luna/screens/home/admin/RolesView';
import { SettingsView } from '@luna/screens/home/admin/SettingsView';
import { UsersView } from '@luna/screens/home/admin/UsersView';
import { RouteObject } from 'react-router-dom';

export const adminRoute: RouteObject = {
  path: 'admin',
  children: [
    {
      index: true,
      element: <AdminView />,
    },
    {
      path: 'resources',
      element: <ResourcesView />,
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
      path: 'roles',
      element: <RolesView />,
    },
    {
      path: 'registration-keys',
      element: <RegistrationKeysView />,
    },
    {
      path: 'settings',
      element: <SettingsView />,
    },
  ],
};
