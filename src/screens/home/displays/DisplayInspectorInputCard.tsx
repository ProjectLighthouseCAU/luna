import { Code, Divider, Kbd, Switch, Tooltip } from '@heroui/react';
import { BooleanChip } from '@luna/components/BooleanChip';
import { TitledCard } from '@luna/components/TitledCard';
import { InputConfig } from '@luna/screens/home/displays/helpers/InputConfig';
import { InputState } from '@luna/screens/home/displays/helpers/InputState';
import {
  IconDeviceGamepad,
  IconDeviceGamepad2,
  IconKeyboard,
  IconMouse,
} from '@tabler/icons-react';
import {
  GamepadEvent,
  KeyEvent,
  LegacyControllerEvent,
  LegacyKeyEvent,
  MouseEvent,
} from 'nighthouse/browser';
import { ReactNode, useCallback } from 'react';

export interface DisplayInspectorInputCardProps {
  username: string;
  inputState: InputState;
  inputConfig: InputConfig;
  setInputConfig: (inputConfig: InputConfig) => void;
}

export function DisplayInspectorInputCard({
  username,
  inputState,
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

  const mouseEnabled = !inputConfig.legacyMode && inputConfig.mouseEnabled;
  const keyboardEnabled = inputConfig.keyboardEnabled;
  const controllerEnabled = inputConfig.controllerEnabled;

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
          thumbIcon={<IconMouse />}
          isSelected={mouseEnabled}
          isDisabled={inputConfig.legacyMode}
          onValueChange={setMouseEnabled}
        >
          Mouse
        </Switch>
        {mouseEnabled ? (
          <MouseEventView event={inputState.lastMouseEvent} />
        ) : undefined}
        <Switch
          thumbIcon={<IconKeyboard />}
          isSelected={keyboardEnabled}
          onValueChange={setKeyboardEnabled}
        >
          Keyboard
        </Switch>
        {keyboardEnabled ? (
          <KeyEventView event={inputState.lastKeyEvent} />
        ) : undefined}
        <Switch
          thumbIcon={<IconDeviceGamepad />}
          isSelected={controllerEnabled}
          onValueChange={setControllerEnabled}
        >
          Controller
        </Switch>
        {controllerEnabled ? (
          <ControllerEventView event={inputState.lastControllerEvent} />
        ) : undefined}
      </div>
    </TitledCard>
  );
}

function MouseEventView({ event }: { event?: MouseEvent }) {
  return event ? (
    <div />
  ) : (
    <EventPlaceholderText>no mouse events yet</EventPlaceholderText>
  );
}

function KeyEventView({ event }: { event?: KeyEvent | LegacyKeyEvent }) {
  return event ? (
    <>
      <div>
        Key: <Kbd>{event.key}</Kbd>
      </div>
      <div>
        Down: <BooleanChip value={'dwn' in event ? event.dwn : event.down} />
      </div>
    </>
  ) : (
    <EventPlaceholderText>no key events yet</EventPlaceholderText>
  );
}

function ControllerEventView({
  event,
}: {
  event?: GamepadEvent | LegacyControllerEvent;
}) {
  return event ? (
    <div />
  ) : (
    <EventPlaceholderText>no controller events yet</EventPlaceholderText>
  );
}

function EventPlaceholderText({ children }: { children: ReactNode }) {
  return <div className="italic text-xs opacity-50">{children}</div>;
}
