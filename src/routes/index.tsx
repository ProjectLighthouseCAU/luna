import { ReactNode } from 'react';
import { Displays } from '@luna/views/Displays';
import { Admin } from '@luna/views/Admin';

export interface RouteNode {
  path: string;
  displayName: string;
  element?: () => ReactNode;
  children: RouteNode[];
}

/** The app's internal routes as displayed in the sidebar. */
export const ROUTE_TREE: RouteNode = {
  path: '',
  displayName: 'Root',
  children: [
    {
      path: 'admin',
      displayName: 'Admin',
      element: () => <Admin />,
      children: [],
    },
    {
      path: 'displays',
      displayName: 'Displays',
      element: () => <Displays />,
      children: [],
    },
  ],
};
