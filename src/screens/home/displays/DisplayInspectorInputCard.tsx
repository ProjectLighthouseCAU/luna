import { TitledCard } from '@luna/components/TitledCard';
import { Code, Divider, Switch, Tooltip } from '@heroui/react';
import { IconDeviceGamepad2 } from '@tabler/icons-react';
import { InputConfig } from '@luna/screens/home/displays/helpers/InputConfig';
import { useCallback } from 'react';

export interface DisplayInspectorInputCardProps {
  username: string;
  inputConfig: InputConfig;
  setInputConfig: (inputConfig: InputConfig) => void;
}

export function DisplayInspectorInputCard({
  username,
  inputConfig,
  setInputConfig,
}: DisplayInspectorInputCardProps) {
  const setLegacyMode = useCallback(
    (legacyMode: boolean) => setInputConfig({ ...inputConfig, legacyMode }),
    [inputConfig, setInputConfig]
  );

  const setMouseEnabled = useCallback(
    (mouseEnabled: boolean) => setInputConfig({ ...inputConfig, mouseEnabled }),
    [inputConfig, setInputConfig]
  );

  const setKeyboardEnabled = useCallback(
    (keyboardEnabled: boolean) =>
      setInputConfig({ ...inputConfig, keyboardEnabled }),
    [inputConfig, setInputConfig]
  );

  const setControllerEnabled = useCallback(
    (controllerEnabled: boolean) =>
      setInputConfig({ ...inputConfig, controllerEnabled }),
    [inputConfig, setInputConfig]
  );

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
          <Switch
            isSelected={inputConfig.legacyMode}
            onValueChange={setLegacyMode}
          >
            Legacy Mode
          </Switch>
        </Tooltip>
        <Divider />
        <Switch
          isSelected={inputConfig.mouseEnabled}
          onValueChange={setMouseEnabled}
        >
          Mouse
        </Switch>
        <Switch
          isSelected={inputConfig.keyboardEnabled}
          onValueChange={setKeyboardEnabled}
        >
          Keyboard
        </Switch>
        <Switch
          isSelected={inputConfig.controllerEnabled}
          onValueChange={setControllerEnabled}
        >
          Controller
        </Switch>
      </div>
    </TitledCard>
  );
}
