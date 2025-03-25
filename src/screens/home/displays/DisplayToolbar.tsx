import { Tab, Tabs } from '@heroui/react';
import { DisplayInspectorTabIcon } from '@luna/screens/home/displays/DisplayInspectorTabIcon';
import { displayInspectorTabs } from '@luna/screens/home/displays/helpers/DisplayInspectorTab';

export interface DisplayToolbarProps {}

export function DisplayToolbar({}: DisplayToolbarProps) {
  return (
    <div className="flex flex-row gap-2">
      <Tabs>
        {displayInspectorTabs.map(tab => (
          <Tab key={tab} title={<DisplayInspectorTabIcon tab={tab} />} />
        ))}
      </Tabs>
    </div>
  );
}
