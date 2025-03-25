import { Tab, Tabs } from '@heroui/react';
import { displayInspectorTabs } from '@luna/screens/home/displays/helpers/DisplayInspectorTab';

export interface DisplayToolbarProps {}

export function DisplayToolbar({}: DisplayToolbarProps) {
  return (
    <div className="flex flex-row gap-2">
      <Tabs>
        {displayInspectorTabs.map(tab => (
          <Tab key={tab} />
        ))}
      </Tabs>
    </div>
  );
}
