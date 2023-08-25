import { TitledCard } from '@luna/components/TitledCard';
import { Switch } from '@nextui-org/react';
import { IconDeviceGamepad2 } from '@tabler/icons-react';

export function DisplayInspectorInputCard() {
  return (
    <TitledCard icon={<IconDeviceGamepad2 />} title="Input">
      <div className="flex flex-col space-y-2">
        <Switch>Keyboard</Switch>
        <Switch>Controller</Switch>
      </div>
    </TitledCard>
  );
}
