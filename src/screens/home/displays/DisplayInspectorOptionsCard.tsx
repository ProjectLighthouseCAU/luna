import { DisplayInspectorCard } from '@luna/screens/home/displays/DisplayInspectorCard';
import { Tab, Tabs } from '@nextui-org/react';
import { IconAdjustments } from '@tabler/icons-react';

export function DisplayInspectorOptionsCard() {
  return (
    <DisplayInspectorCard icon={<IconAdjustments />} title="Options">
      <Tabs>
        <Tab key="public" title="Public" />
        <Tab key="private" title="Private" />
      </Tabs>
    </DisplayInspectorCard>
  );
}
