import { Code, Divider, Switch, Tooltip } from '@heroui/react';
import {
  Names,
  ObjectInspectorTable,
} from '@luna/components/ObjectInspectorTable';
import { TitledCard } from '@luna/components/TitledCard';
import { InputConfig } from '@luna/screens/home/displays/helpers/InputConfig';
import { InputState } from '@luna/screens/home/displays/helpers/InputState';
import { AnimatePresence } from '@luna/utils/motion';
import {
  IconDeviceGamepad,
  IconDeviceGamepad2,
  IconKeyboard,
  IconMouse,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
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
        <AnimatedPresence isShown={mouseEnabled}>
          <MouseEventView event={inputState.lastMouseEvent} />
        </AnimatedPresence>
        <Switch
          thumbIcon={<IconKeyboard />}
          isSelected={keyboardEnabled}
          onValueChange={setKeyboardEnabled}
        >
          Keyboard
        </Switch>
        <AnimatedPresence isShown={keyboardEnabled}>
          <KeyEventView event={inputState.lastKeyEvent} />
        </AnimatedPresence>
        <Switch
          thumbIcon={<IconDeviceGamepad />}
          isSelected={controllerEnabled}
          onValueChange={setControllerEnabled}
        >
          Controller
        </Switch>
        <AnimatedPresence isShown={controllerEnabled}>
          <ControllerEventView
            gamepadCount={inputState.gamepadCount}
            events={inputState.lastControllerEvents}
          />
        </AnimatedPresence>
      </div>
    </TitledCard>
  );
}

function AnimatedPresence({
  isShown,
  children,
}: {
  isShown: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={isShown}>
      {isShown ? (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      ) : undefined}
    </AnimatePresence>
  );
}

const mouseEventNames: Names<MouseEvent> = {
  button: 'Button',
  down: 'Down',
  pos: 'Pos',
};

function MouseEventView({ event }: { event?: MouseEvent }) {
  return event ? (
    <ObjectInspectorTable objects={[event]} names={mouseEventNames} />
  ) : (
    <EventInfoText>no mouse events yet</EventInfoText>
  );
}

const keyEventNames: Names<KeyEvent> = {
  key: 'Key',
  down: 'Down',
};

const legacyKeyEventNames: Names<LegacyKeyEvent> = {
  key: 'Key',
  dwn: 'Down',
};

function KeyEventView({ event }: { event?: KeyEvent | LegacyKeyEvent }) {
  return event ? (
    'dwn' in event ? (
      <ObjectInspectorTable objects={[event]} names={legacyKeyEventNames} />
    ) : (
      <ObjectInspectorTable objects={[event]} names={keyEventNames} />
    )
  ) : (
    <EventInfoText>no key events yet</EventInfoText>
  );
}

const legacyControllerEventNames: Names<LegacyControllerEvent> = {
  btn: 'Button',
  dwn: 'Down',
};

function ControllerEventView({
  gamepadCount,
  events = [],
}: {
  gamepadCount?: number;
  events?: GamepadEvent[] | LegacyControllerEvent[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <EventInfoText>
        {gamepadCount ?? '?'} gamepad{gamepadCount === 1 ? '' : 's'} connected
      </EventInfoText>
      {events.length > 0 ? (
        'dwn' in events[0] ? (
          <ObjectInspectorTable
            objects={events as LegacyControllerEvent[]}
            names={legacyControllerEventNames}
          />
        ) : (
          <div>TODO</div>
        )
      ) : (
        <EventInfoText>no controller events yet</EventInfoText>
      )}
    </div>
  );
}

function EventInfoText({ children }: { children: ReactNode }) {
  return <div className="italic text-xs opacity-50">{children}</div>;
}
