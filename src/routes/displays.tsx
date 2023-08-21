import { UnderConstruction } from '@luna/components/UnderConstruction';
import { DisplaysView } from '@luna/screens/home/displays/DisplaysView';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { RouteObject } from 'react-router-dom';

export const displaysRoute: RouteObject = {
  path: 'displays',
  children: [
    {
      index: true,
      element: (
        <HomeContent title="Displays">
          <DisplaysView />
        </HomeContent>
      ),
    },
    {
      path: ':username',
      element: (
        <HomeContent title="Display">
          <UnderConstruction />
        </HomeContent>
      ),
    },
  ],
};
