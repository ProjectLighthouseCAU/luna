import { ReactNode } from 'react';
import { Displays } from '@luna/views/Displays';
import { Admin } from '@luna/views/Admin';
import { IconActivity, IconBuildingLighthouse, IconTower } from '@tabler/icons';
import { UnderConstruction } from '@luna/components/UnderConstruction';
import { Outlet } from 'react-router-dom';

export interface RouteNode {
  path?: string;
  displayName?: string;
  index?: RouteNode;
  element?: () => ReactNode;
  icon?: () => ReactNode;
  children?: RouteNode[];
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

export function lookupRouteNode(
  node: RouteNode,
  path: string[]
): RouteNode | undefined {
  if (path.length > 0) {
    if (node.path === path[0]) {
      return lookupRouteNode(node, path.slice(1));
    } else {
      const child = node.children?.find(child => child.path === path[0]);
      return child ? lookupRouteNode(child, path.slice(1)) : undefined;
    }
  } else {
    return node;
  }
}
