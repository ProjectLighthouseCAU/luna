import { ReactNode } from 'react';

export interface RouteNode {
  name: string;
  displayName: string;
  element?: () => ReactNode;
  children: RouteNode[];
}

export const ROUTE_TREE: RouteNode = {
  name: '/',
  displayName: 'Root',
  children: [
    {
      name: 'admin',
      displayName: 'Admin',
      children: [],
    },
    {
      name: 'displays',
      displayName: 'Displays',
      children: [],
    },
  ],
};
