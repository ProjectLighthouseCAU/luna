import { ReactNode } from 'react';
import { Displays } from '@luna/views/Displays';
import { Admin } from '@luna/views/Admin';
import { IconActivity, IconBuildingLighthouse, IconTower } from '@tabler/icons';
import { UnderConstruction } from '@luna/components/UnderConstruction';

export interface RouteNode {
  path: string;
  displayName: string;
  element?: () => ReactNode;
  icon?: () => ReactNode;
  children: RouteNode[];
}

// TODO: Add 'resolve' function to resolve RouteNode[] for the sidebar dynamically

/** The app's internal routes as displayed in the sidebar. */
export const ROUTE_TREE: RouteNode = {
  path: '',
  displayName: 'Root',
  children: [
    {
      path: 'admin',
      displayName: 'Admin',
      element: () => <Admin />,
      icon: () => <IconTower />,
      children: [
        {
          path: 'monitor',
          displayName: 'Monitor',
          icon: () => <IconActivity />,
          element: () => <UnderConstruction />,
          children: [],
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
