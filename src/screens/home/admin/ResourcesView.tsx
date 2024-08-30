import { UnderConstruction } from '@luna/components/UnderConstruction';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { ResourcesLayout } from '@luna/screens/home/admin/ResourcesLayout';
import { ResourcesToolbar } from '@luna/screens/home/admin/ResourcesToolbar';
import { HomeContent } from '@luna/screens/home/HomeContent';

export function ResourcesView() {
  const [layout, setLayout] = useLocalStorage<ResourcesLayout>(
    LocalStorageKey.AdminResourcesLayout,
    () => 'column'
  );

  return (
    <HomeContent
      title="Resources"
      toolbar={<ResourcesToolbar layout={layout} onLayoutChange={setLayout} />}
    >
      <UnderConstruction />
    </HomeContent>
  );
}
