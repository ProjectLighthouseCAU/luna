import { Tab, Tabs } from '@heroui/react';
import { DisplayInspectorTabIcon } from '@luna/screens/home/displays/DisplayInspectorTabIcon';
import {
  DisplayInspectorTab,
  displayInspectorTabs,
} from '@luna/screens/home/displays/helpers/DisplayInspectorTab';
import { Key } from 'react';

export interface DisplayToolbarProps {
  tab: DisplayInspectorTab;
  setTab: (tab: DisplayInspectorTab) => void;
}

export function DisplayToolbar({ tab, setTab }: DisplayToolbarProps) {
  return (
    <div className="flex flex-row gap-2">
      <Tabs selectedKey={tab} onSelectionChange={setTab as (tab: Key) => void}>
        {displayInspectorTabs.map(tab => (
          <Tab key={tab} title={<DisplayInspectorTabIcon tab={tab} />} />
        ))}
      </Tabs>
    </div>
  );
}
