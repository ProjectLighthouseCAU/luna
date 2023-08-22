import { DisplayInspectorCard } from '@luna/screens/home/displays/DisplayInspectorCard';
import { Button, Switch, Tooltip } from '@nextui-org/react';
import {
  IconClipboard,
  IconDeviceGamepad2,
  IconLink,
} from '@tabler/icons-react';

export function DisplayInspector() {
  // TODO: Implement actual functionality
  return (
    <div className="flex flex-col space-y-3">
      <DisplayInspectorCard icon={<IconLink />} title="API Token">
        <div className="flex flex-row items-center space-x-1">
          <Tooltip content="Show the token">
            <Button size="md">Reveal</Button>
          </Tooltip>
          <Tooltip content="Copy the token">
            <Button isIconOnly size="md">
              <IconClipboard />
            </Button>
          </Tooltip>
        </div>
      </DisplayInspectorCard>
      <DisplayInspectorCard icon={<IconDeviceGamepad2 />} title="Input">
        <div className="flex flex-col space-y-2">
          <Switch>Keyboard</Switch>
          <Switch>Controller</Switch>
        </div>
      </DisplayInspectorCard>
    </div>
  );
}
