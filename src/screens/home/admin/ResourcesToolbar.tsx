import {
  ResourcesLayout,
  resourcesLayouts,
} from '@luna/screens/home/admin/ResourcesLayout';
import { ResourcesLayoutIcon } from '@luna/screens/home/admin/ResourcesLayoutIcon';
import { Tab, Tabs } from '@nextui-org/react';
import { Key } from 'react';

export interface ResourcesToolbarProps {
  layout: ResourcesLayout;
  onLayoutChange: (layout: ResourcesLayout) => void;
}

export function ResourcesToolbar({
  layout,
  onLayoutChange,
}: ResourcesToolbarProps) {
  return (
    <Tabs
      selectedKey={layout}
      onSelectionChange={onLayoutChange as (layout: Key) => void}
    >
      {resourcesLayouts.map(layout => (
        <Tab key={layout} title={<ResourcesLayoutIcon layout={layout} />} />
      ))}
    </Tabs>
  );
}
