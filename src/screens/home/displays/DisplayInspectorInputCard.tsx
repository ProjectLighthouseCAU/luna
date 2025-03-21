import { Checkbox, Code, Divider, Switch, Tooltip } from '@heroui/react';
import {
  Names,
  ObjectInspectorTable,
} from '@luna/components/ObjectInspectorTable';
import { TitledCard } from '@luna/components/TitledCard';
import { InputConfig } from '@luna/screens/home/displays/helpers/InputConfig';
import { InputState } from '@luna/screens/home/displays/helpers/InputState';
import { AnimatePresence } from '@luna/utils/motion';
import {
  IconAlt,
  IconArrowBigUp,
  IconChevronUp,
  IconCommand,
  IconDeviceGamepad,
  IconDeviceGamepad2,
  IconKeyboard,
  IconMouse,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import {
  GamepadEvent,
  KeyEvent,
  KeyModifiers,
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

  const setPointerLockable = useCallback(
    (pointerLockable: boolean) =>
      setInputConfig({ ...inputConfig, pointerLockable }),
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
      <div className="flex flex-col space-y-2 md:w-[200px]">
        <Tooltip
          placement="left"
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
          <MouseEventView
            event={inputState.lastMouseEvent}
            isPointerLockable={inputConfig.pointerLockable}
            setPointerLockable={setPointerLockable}
          />
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
            event={inputState.lastControllerEvents?.at(-1)}
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
  movement: 'Movement',
};

function MouseEventView({
  event,
  isPointerLockable,
  setPointerLockable,
}: {
  event?: MouseEvent;
  isPointerLockable: boolean;
  setPointerLockable: (locked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {event ? (
        <ObjectInspectorTable objects={[event]} names={mouseEventNames} />
      ) : (
        <EventInfoText>no mouse events yet</EventInfoText>
      )}
      <Divider />
      <Tooltip
        placement="left"
        content={
          <>
            Enabling this will lock the pointer when clicking the lighthouse
            canvas. Pressing escape will unlock the pointer again.
          </>
        }
        classNames={{ content: 'w-60' }}
      >
        <Checkbox
          isSelected={isPointerLockable}
          onValueChange={setPointerLockable}
        >
          <span className="text-sm">Enable Pointer Lock</span>
        </Checkbox>
      </Tooltip>
      <Divider />
    </div>
  );
}

const keyEventNames: Names<KeyEvent> = {
  down: 'Down',
  repeat: 'Repeat',
  code: 'Code',
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
      <div className="flex flex-col items-center gap-1">
        <ObjectInspectorTable objects={[event]} names={keyEventNames} />
        <Divider />
        <KeyModifiersView modifiers={event.modifiers} />
        <Divider />
      </div>
    )
  ) : (
    <EventInfoText>no key events yet</EventInfoText>
  );
}

function KeyModifiersView({ modifiers }: { modifiers: KeyModifiers }) {
  return (
    <div className="flex flex-row gap-2">
      <ModifierView down={modifiers.shift}>
        <IconArrowBigUp />
      </ModifierView>
      <ModifierView down={modifiers.ctrl}>
        <IconChevronUp />
      </ModifierView>
      <ModifierView down={modifiers.alt}>
        <IconAlt />
      </ModifierView>
      <ModifierView down={modifiers.meta}>
        <IconCommand />
      </ModifierView>
    </div>
  );
}

function ModifierView({
  down,
  children,
}: {
  down: boolean;
  children: ReactNode;
}) {
  return <div className={down ? '' : 'opacity-50'}>{children}</div>;
}

const legacyControllerEventNames: Names<LegacyControllerEvent> = {
  btn: 'Button',
  dwn: 'Down',
};

const gamepadEventNames: Names<GamepadEvent> = {
  control: 'Control',
  index: 'Index',
  down: 'Down',
  value: 'Value',
};

function ControllerEventView({
  gamepadCount,
  event,
}: {
  gamepadCount?: number;
  event?: GamepadEvent | LegacyControllerEvent;
}) {
  return (
    <div className="flex flex-col gap-1">
      <EventInfoText>
        {gamepadCount ?? '?'} gamepad{gamepadCount === 1 ? '' : 's'} connected
      </EventInfoText>
      {event ? (
        'dwn' in event ? (
          <ObjectInspectorTable
            objects={[event]}
            names={legacyControllerEventNames}
          />
        ) : (
          <ObjectInspectorTable objects={[event]} names={gamepadEventNames} />
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
