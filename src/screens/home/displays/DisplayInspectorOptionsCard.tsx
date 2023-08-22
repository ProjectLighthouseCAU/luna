import { DisplayInspectorCard } from '@luna/screens/home/displays/DisplayInspectorCard';
import { Switch } from '@nextui-org/react';
import { IconAdjustments } from '@tabler/icons-react';

export function DisplayInspectorOptionsCard() {
  return (
    <DisplayInspectorCard icon={<IconAdjustments />} title="Options">
      <Switch>Public</Switch>
    </DisplayInspectorCard>
  );
}
