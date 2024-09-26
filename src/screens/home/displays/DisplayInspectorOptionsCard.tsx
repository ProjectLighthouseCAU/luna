import { TitledCard } from '@luna/components/TitledCard';
import { Tab, Tabs } from '@nextui-org/react';
import { IconAdjustments } from '@tabler/icons-react';

export function DisplayInspectorOptionsCard() {
  return (
    <TitledCard icon={<IconAdjustments />} title="Options">
      <Tabs isDisabled={true}>
        <Tab key="public" title="Public" />
        <Tab key="private" title="Private" />
      </Tabs>
    </TitledCard>
  );
}
