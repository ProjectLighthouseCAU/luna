import { DisplaysView } from '@luna/screens/home/displays/DisplaysView';
import { DisplayView } from '@luna/screens/home/displays/DisplayView';
import { RouteObject } from 'react-router-dom';

export const displaysRoute: RouteObject = {
  path: 'displays',
  children: [
    {
      index: true,
      element: <DisplaysView />,
    },
    {
      path: ':username',
      element: <DisplayView />,
    },
  ],
};
