import { DisplayInspectorCard } from '@luna/screens/home/displays/DisplayInspectorCard';
import { Button, Tooltip } from '@nextui-org/react';
import { IconClipboard, IconLink } from '@tabler/icons-react';

export function DisplayInspectorApiTokenCard() {
  return (
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
  );
}
