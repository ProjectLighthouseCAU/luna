import { TitledCard } from '@luna/components/TitledCard';
import { Tab, Tabs } from '@heroui/react';
import { IconAdjustments } from '@tabler/icons-react';

export interface DisplayInspectorOptionsCardProps {
  isEditable: boolean;
}

export function DisplayInspectorOptionsCard({
  isEditable,
}: DisplayInspectorOptionsCardProps) {
  // TODO: Respect isEditable (after implementing it)
  return (
    <TitledCard icon={<IconAdjustments />} title="Options" isCollapsible>
      <Tabs isDisabled={true}>
        <Tab key="public" title="Public" />
        <Tab key="private" title="Private" />
      </Tabs>
    </TitledCard>
  );
}
