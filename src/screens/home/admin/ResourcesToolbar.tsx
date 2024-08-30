import { Tab, Tabs } from '@nextui-org/react';
import { IconLayoutColumns, IconList } from '@tabler/icons-react';

export function ResourcesToolbar() {
  return (
    <Tabs>
      <Tab key="list" title={<IconList />} />
      <Tab key="columns" title={<IconLayoutColumns />} />
    </Tabs>
  );
}
