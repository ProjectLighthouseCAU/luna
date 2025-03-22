import { Checkbox, Code, Divider, Switch, Tooltip } from '@heroui/react';
import {
  Names,
  ObjectInspectorTable,
} from '@luna/components/ObjectInspectorTable';
import { TitledCard } from '@luna/components/TitledCard';
import { InputCapabilities } from '@luna/screens/home/displays/helpers/InputCapabilities';
import { InputConfig } from '@luna/screens/home/displays/helpers/InputConfig';
import { InputState } from '@luna/screens/home/displays/helpers/InputState';
import { AnimatePresence } from '@luna/utils/motion';
import { pluralize } from '@luna/utils/string';
import {
  IconAlt,
  IconArrowBigUp,
  IconChevronsRight,
  IconChevronUp,
  IconCommand,
  IconDeviceGamepad,
  IconDeviceGamepad2,
  IconGeometry,
  IconKeyboard,
  IconMouse,
  IconPiano,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import {
  GamepadEvent,
  KeyEvent,
  KeyModifiers,
  LegacyControllerEvent,
  LegacyKeyEvent,
  MIDIEvent,
  MotionEvent,
  MouseEvent,
  OrientationEvent,
} from 'nighthouse/browser';
import { ReactNode, useCallback } from 'react';

export interface DisplayInspectorInputCardProps {
  username: string;
  inputState: InputState;
  inputConfig: InputConfig;
  setInputConfig: (inputConfig: InputConfig) => void;
  inputCapabilities: InputCapabilities;
}

export function DisplayInspectorInputCard({
  username,
  inputState,
  inputConfig,
  setInputConfig,
  inputCapabilities,
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

  const setGamepadEnabled = useCallback(
    (gamepadEnabled: boolean) =>
      setInputConfig({ ...inputConfig, gamepadEnabled }),
    [inputConfig, setInputConfig]
  );

  const setMIDIEnabled = useCallback(
    (midiEnabled: boolean) => setInputConfig({ ...inputConfig, midiEnabled }),
    [inputConfig, setInputConfig]
  );

  const setOrientationEnabled = useCallback(
    (orientationEnabled: boolean) =>
      setInputConfig({ ...inputConfig, orientationEnabled }),
    [inputConfig, setInputConfig]
  );

  const setMotionEnabled = useCallback(
    (motionEnabled: boolean) =>
      setInputConfig({ ...inputConfig, motionEnabled }),
    [inputConfig, setInputConfig]
  );

  const mouseSupported = !inputConfig.legacyMode;
  const gamepadSupported = inputCapabilities.gamepadSupported;
  const midiSupported =
    !inputConfig.legacyMode && inputCapabilities.midiSupported;
  const orientationSupported =
    !inputConfig.legacyMode && inputCapabilities.orientationSupported;
  const motionSupported =
    !inputConfig.legacyMode && inputCapabilities.motionSupported;

  const mouseEnabled = mouseSupported && inputConfig.mouseEnabled;
  const keyboardEnabled = inputConfig.keyboardEnabled;
  const gamepadEnabled = gamepadSupported && inputConfig.gamepadEnabled;
  const midiEnabled = midiSupported && inputConfig.midiEnabled;
  const orientationEnabled =
    orientationSupported && inputConfig.orientationEnabled;
  const motionEnabled = motionSupported && inputConfig.motionEnabled;

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
            size="sm"
            isSelected={inputConfig.legacyMode}
            onValueChange={setLegacyMode}
          >
            Legacy Mode
          </Switch>
        </Tooltip>
        <Divider />
        <Switch
          size="sm"
          thumbIcon={<IconMouse />}
          isSelected={mouseEnabled}
          isDisabled={!mouseSupported}
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
          size="sm"
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
          size="sm"
          thumbIcon={<IconDeviceGamepad />}
          isSelected={gamepadEnabled}
          isDisabled={!gamepadSupported}
          onValueChange={setGamepadEnabled}
        >
          Gamepad
        </Switch>
        <AnimatedPresence isShown={gamepadEnabled}>
          <GamepadEventView
            gamepadCount={inputState.gamepadCount}
            event={inputState.lastControllerEvents?.at(-1)}
          />
        </AnimatedPresence>
        <Switch
          size="sm"
          thumbIcon={<IconPiano />}
          isSelected={midiEnabled}
          isDisabled={!midiSupported}
          onValueChange={setMIDIEnabled}
        >
          MIDI
        </Switch>
        <AnimatedPresence isShown={midiEnabled}>
          <MIDIEventView
            midiInputCount={inputState.midiInputCount}
            event={inputState.lastMIDIEvent}
          />
        </AnimatedPresence>
        <Tooltip placement="left" content="Only supported on mobile">
          <Switch
            size="sm"
            thumbIcon={<IconGeometry />}
            isSelected={orientationEnabled}
            isDisabled={!orientationSupported}
            onValueChange={setOrientationEnabled}
          >
            Orientation
          </Switch>
        </Tooltip>
        <AnimatedPresence isShown={orientationEnabled}>
          <OrientationEventView />
        </AnimatedPresence>
        <Tooltip placement="left" content="Only supported on mobile">
          <Switch
            size="sm"
            thumbIcon={<IconChevronsRight />}
            isSelected={motionEnabled}
            isDisabled={!motionSupported}
            onValueChange={setMotionEnabled}
          >
            Motion
          </Switch>
        </Tooltip>
        <AnimatedPresence isShown={motionEnabled}>
          <MotionEventView />
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

function GamepadEventView({
  gamepadCount,
  event,
}: {
  gamepadCount?: number;
  event?: GamepadEvent | LegacyControllerEvent;
}) {
  return (
    <div className="flex flex-col gap-1">
      <EventInfoText>
        {gamepadCount ?? '?'} {pluralize('gamepad', gamepadCount)} connected
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
        <EventInfoText>no gamepad events yet</EventInfoText>
      )}
    </div>
  );
}

const midiEventNames: Names<MIDIEvent> = {
  data: 'Data',
};

function MIDIEventView({
  midiInputCount,
  event,
}: {
  midiInputCount: number;
  event?: MIDIEvent;
}) {
  return (
    <div className="flex flex-col gap-1">
      <EventInfoText>
        {midiInputCount ?? '?'} MIDI {pluralize('input', midiInputCount)}{' '}
        connected
      </EventInfoText>
      {event ? (
        <ObjectInspectorTable objects={[event]} names={midiEventNames} />
      ) : (
        <EventInfoText>no MIDI events yet</EventInfoText>
      )}
    </div>
  );
}

const orientationEventNames: Names<OrientationEvent> = {
  absolute: 'Absolute',
  alpha: 'Alpha',
  beta: 'Beta',
  gamma: 'Gamma',
};

function OrientationEventView({ event }: { event?: OrientationEvent }) {
  return event ? (
    <ObjectInspectorTable objects={[event]} names={orientationEventNames} />
  ) : (
    <EventInfoText>no orientation events yet</EventInfoText>
  );
}

const motionEventNames: Names<MotionEvent> = {
  acceleration: 'Acceleration',
  accelerationIncludingGravity: 'Acceleration (incl. Gravity)',
  interval: 'Interval',
  rotationRate: 'Rotation rate',
};

function MotionEventView({ event }: { event?: MotionEvent }) {
  return event ? (
    <ObjectInspectorTable objects={[event]} names={motionEventNames} />
  ) : (
    <EventInfoText>no motion events yet</EventInfoText>
  );
}

function EventInfoText({ children }: { children: ReactNode }) {
  return <div className="italic text-xs opacity-50">{children}</div>;
}
