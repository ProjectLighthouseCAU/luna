import { Displays } from '@luna/screens/home/Displays';
import { Admin } from '@luna/screens/home/Admin';
import {
  IconActivity,
  IconBuildingLighthouse,
  IconSettings,
  IconTower,
} from '@tabler/icons-react';
import { UnderConstruction } from '@luna/components/UnderConstruction';
import { Outlet } from 'react-router-dom';
import { RouteNode } from '@luna/types/RouteNode';

/** The app's internal routes as displayed in the sidebar. */
export const ROUTE_TREE: RouteNode = {
  path: '',
  displayName: 'Root',
  children: [
    {
      path: 'admin',
      displayName: 'Admin',
      element: () => <Outlet />,
      icon: () => <IconTower />,
      index: {
        element: () => <Admin />,
      },
      children: [
        {
          path: 'monitor',
          displayName: 'Monitor',
          icon: () => <IconActivity />,
          element: () => <UnderConstruction />,
          children: [],
        },
        {
          path: 'settings',
          displayName: 'Settings',
          icon: () => <IconSettings />,
        },
      ],
    },
    {
      path: 'displays',
      displayName: 'Displays',
      element: () => <Displays />,
      icon: () => <IconBuildingLighthouse />,
      children: [],
    },
  ],
};
