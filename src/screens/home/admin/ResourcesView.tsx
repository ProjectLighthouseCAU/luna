import { UnderConstruction } from '@luna/components/UnderConstruction';
import { ResourcesToolbar } from '@luna/screens/home/admin/ResourcesToolbar';
import { HomeContent } from '@luna/screens/home/HomeContent';

export function ResourcesView() {
  return (
    <HomeContent title="Resources" toolbar={<ResourcesToolbar />}>
      <UnderConstruction />
    </HomeContent>
  );
}
