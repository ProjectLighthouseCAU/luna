import { TitledCard } from '@luna/components/TitledCard';
import { Code, Divider, Switch, Tooltip } from '@heroui/react';
import { IconDeviceGamepad2 } from '@tabler/icons-react';

export interface DisplayInspectorInputCardProps {
  username: string;
}

export function DisplayInspectorInputCard({
  username,
}: DisplayInspectorInputCardProps) {
  return (
    <TitledCard icon={<IconDeviceGamepad2 />} title="Input">
      <div className="flex flex-col space-y-2">
        <Tooltip
          content={
            <div className="flex flex-col gap-2">
              <span>
                Sends input in the classic format to{' '}
                <Code className="text-xs">user/{username}/model</Code>. Enable
                this if your client or library still uses the old API.
              </span>
              <span>
                Disabling this will send input events to{' '}
                <Code className="text-xs">user/{username}/input</Code> using a
                new schema instead.
              </span>
            </div>
          }
          classNames={{ content: 'w-60' }}
        >
          <Switch>Legacy Mode</Switch>
        </Tooltip>
        <Divider />
        <Switch isDisabled={true}>Mouse</Switch>
        <Switch isDisabled={true}>Keyboard</Switch>
        <Switch isDisabled={true}>Controller</Switch>
      </div>
    </TitledCard>
  );
}
