import { TitledCard } from '@luna/components/TitledCard';
import { Tab, Tabs } from '@heroui/react';
import { IconAdjustments } from '@tabler/icons-react';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';

export interface DisplayInspectorOptionsCardProps {
  isEditable: boolean;
}

export function DisplayInspectorOptionsCard({
  isEditable,
}: DisplayInspectorOptionsCardProps) {
  const [isCollapsed, storeCollapsed] = useLocalStorage(
    LocalStorageKey.DisplayInspectorOptionsCollapsed,
    () => false
  );

  // TODO: Respect isEditable (after implementing it)
  return (
    <TitledCard
      icon={<IconAdjustments />}
      title="Options"
      isCollapsible
      initiallyCollapsed={isCollapsed}
      onSetCollapsed={storeCollapsed}
    >
      <Tabs isDisabled={true}>
        <Tab key="public" title="Public" />
        <Tab key="private" title="Private" />
      </Tabs>
    </TitledCard>
  );
}
