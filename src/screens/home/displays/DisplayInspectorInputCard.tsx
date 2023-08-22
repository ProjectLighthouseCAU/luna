import { DisplayInspectorCard } from '@luna/screens/home/displays/DisplayInspectorCard';
import { Switch } from '@nextui-org/react';
import { IconDeviceGamepad2 } from '@tabler/icons-react';

export function DisplayInspectorInputCard() {
  return (
    <DisplayInspectorCard icon={<IconDeviceGamepad2 />} title="Input">
      <div className="flex flex-col space-y-2">
        <Switch>Keyboard</Switch>
        <Switch>Controller</Switch>
      </div>
    </DisplayInspectorCard>
  );
}
