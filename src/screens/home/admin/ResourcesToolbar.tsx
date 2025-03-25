import {
  ResourcesLayout,
  resourcesLayouts,
} from '@luna/screens/home/admin/helpers/ResourcesLayout';
import { ResourcesLayoutIcon } from '@luna/screens/home/admin/ResourcesLayoutIcon';
import { Button, Tab, Tabs } from '@heroui/react';
import { Key } from 'react';
import { IconRefresh } from '@tabler/icons-react';

export interface ResourcesToolbarProps {
  layout: ResourcesLayout;
  onLayoutChange: (layout: ResourcesLayout) => void;
  refreshListing: () => void;
}

export function ResourcesToolbar({
  layout,
  onLayoutChange,
  refreshListing,
}: ResourcesToolbarProps) {
  return (
    <div className="flex flex-row gap-2">
      <Button color="secondary" onPress={refreshListing} variant="ghost">
        <IconRefresh />
        Refresh Listing
      </Button>
      <Tabs
        selectedKey={layout}
        onSelectionChange={onLayoutChange as (layout: Key) => void}
      >
        {resourcesLayouts.map(layout => (
          <Tab key={layout} title={<ResourcesLayoutIcon layout={layout} />} />
        ))}
      </Tabs>
    </div>
  );
}
