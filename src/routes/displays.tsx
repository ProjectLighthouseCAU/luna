import { Displays } from '@luna/screens/home/Displays';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { RouteObject } from 'react-router-dom';

export const displaysRoute: RouteObject = {
  path: 'displays',
  element: (
    <HomeContent title="Displays">
      <Displays />
    </HomeContent>
  ),
};
