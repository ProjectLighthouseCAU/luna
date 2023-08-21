import { DisplayInspectorCard } from '@luna/screens/home/displays/DisplayInspectorCard';
import { Switch } from '@nextui-org/react';
import { IconDeviceGamepad2, IconLink } from '@tabler/icons-react';

export function DisplayInspector() {
  // TODO: Implement actual functionality
  return (
    <div className="flex flex-col space-y-3">
      <DisplayInspectorCard icon={<IconLink />} title="API Token" />
      <DisplayInspectorCard icon={<IconDeviceGamepad2 />} title="Input">
        <div className="flex flex-col space-y-2">
          <Switch>Keyboard</Switch>
          <Switch>Controller</Switch>
        </div>
      </DisplayInspectorCard>
    </div>
  );
}
