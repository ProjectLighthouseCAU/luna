import { Display, DISPLAY_ASPECT_RATIO } from '@luna/components/Display';
import { displayLayoutId } from '@luna/constants/LayoutId';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { ClientIdContext } from '@luna/contexts/env/ClientIdContext';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useEventListener } from '@luna/hooks/useEventListener';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { DisplayInspector } from '@luna/screens/home/displays/DisplayInspector';
import { InputConfig } from '@luna/screens/home/displays/helpers/InputConfig';
import { InputState } from '@luna/screens/home/displays/helpers/InputState';
import {
  captureGamepadStates,
  diffGamepadStates,
  GamepadButtonChange,
  GamepadState,
} from '@luna/utils/gamepad';
import { throttle } from '@luna/utils/schedule';
import { Vec2 } from '@luna/utils/vec2';
import { motion } from 'framer-motion';
import {
  GamepadEvent,
  KeyEvent,
  LegacyControllerEvent,
  LegacyKeyEvent,
  MouseEvent,
} from 'nighthouse/browser';
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

export function DisplayView() {
  const { username } = useParams() as { username: string };

  const { clientId } = useContext(ClientIdContext);

  const { users, api } = useContext(ModelContext);

  const [inputState, setInputState] = useState<InputState>({ gamepadCount: 0 });
  const [inputConfig, setInputConfig] = useLocalStorage<InputConfig>(
    LocalStorageKey.DisplayInputConfig,
    () => ({
      legacyMode: true,
      mouseEnabled: false,
      keyboardEnabled: false,
      controllerEnabled: false,
    })
  );

  const [maxSize, setMaxSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const userModel = users.models.get(username);

  const onResize = useMemo(
    () =>
      throttle(() => {
        const wrapper = wrapperRef.current;
        if (wrapper) {
          setMaxSize({
            width: wrapper.clientWidth,
            height: wrapper.clientHeight,
          });
        }
      }, 50),
    []
  );

  const onKeyEvent = useCallback(
    async (e: KeyboardEvent, down: boolean) => {
      // Ignore keyboard events on text fields (e.g. the search bar)
      if (e.target instanceof HTMLInputElement && e.target.type === 'text') {
        return;
      }

      if (!inputConfig.keyboardEnabled) {
        return;
      }

      if (inputConfig.legacyMode) {
        const event: LegacyKeyEvent = {
          src: 0,
          dwn: down,
          key: e.keyCode,
        };
        await api.putLegacyInput(username, event);
        setInputState(state => ({ ...state, lastKeyEvent: event }));
      } else {
        const event: KeyEvent = {
          type: 'key',
          source: clientId,
          down,
          repeat: e.repeat,
          code: e.code,
          altKey: e.altKey,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
        };
        await api.putInput(username, event);
        setInputState(state => ({ ...state, lastKeyEvent: event }));
      }
    },
    [
      clientId,
      inputConfig.keyboardEnabled,
      inputConfig.legacyMode,
      api,
      username,
    ]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => onKeyEvent(e, true),
    [onKeyEvent]
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => onKeyEvent(e, false),
    [onKeyEvent]
  );

  useEventListener(window, 'resize', onResize);
  useEventListener(document, 'keydown', onKeyDown);
  useEventListener(document, 'keyup', onKeyUp);

  // Unfortunately gamepadconnected and gamepaddisconnected events seem to be
  // unreliable, so we'll just poll manually

  useEffect(() => {
    const interval = window.setInterval(() => {
      const count =
        navigator.getGamepads()?.filter(g => g !== null).length ?? 0;
      setInputState(state => ({ ...state, gamepadCount: count }));
    }, 400);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const gamepadsActive = useMemo(
    () => inputState.gamepadCount > 0 && inputConfig.controllerEnabled,
    [inputConfig.controllerEnabled, inputState.gamepadCount]
  );

  useEffect(() => {
    if (!gamepadsActive) {
      return;
    }

    let lastStates: GamepadState[] = [];

    const interval = window.setInterval(async () => {
      // Compute new state in the form of events
      const states = captureGamepadStates();

      // Check whether gamepad state changed
      const changes = diffGamepadStates(lastStates, states);

      if (changes.length > 0) {
        if (inputConfig.legacyMode) {
          // Convert and send events to the legacy API
          const legacyEvents: LegacyControllerEvent[] = changes
            .filter(change => change.control === 'button')
            .map(change => ({
              src: 1 + change.source,
              btn: change.index,
              // Unfortunately, our build chain's TS compiler isn't smart enough
              // to prove this without a cast, while VSCode interestingly is
              dwn: (change as GamepadButtonChange).down,
            }));

          for (const event of legacyEvents) {
            await api.putLegacyInput(username, event);
          }

          if (legacyEvents.length > 0) {
            setInputState(state => ({
              ...state,
              lastControllerEvents: legacyEvents,
            }));
          }
        } else {
          // Convert and send events to the new input API
          const events: GamepadEvent[] = changes.map(change => ({
            ...change,
            type: 'gamepad',
            source: `${clientId}:${change.source}`,
          }));

          for (const event of events) {
            await api.putInput(username, event);
          }

          if (events.length > 0) {
            setInputState(state => ({
              ...state,
              lastControllerEvents: events,
            }));
          }
        }

        lastStates = states;
      }
    }, 10);
    console.log('Registered gamepad polling loop', interval);

    return () => {
      window.clearInterval(interval);
      console.log('Unregistered gamepad polling loop', interval);
    };
  }, [clientId, inputConfig.legacyMode, api, username, gamepadsActive]);

  const mouseActive = !inputConfig.legacyMode && inputConfig.mouseEnabled;

  const onMouseEvent = useCallback(
    async (pos: Vec2<number>, down: boolean) => {
      if (!mouseActive) {
        return;
      }

      const event: MouseEvent = {
        type: 'mouse',
        source: clientId,
        button: 'left', // TODO
        down,
        pos,
      };
      await api.putInput(username, event);
      setInputState(state => ({ ...state, lastMouseEvent: event }));
    },
    [mouseActive, clientId, api, username]
  );

  const onMouseDown = useCallback(
    (pos?: Vec2<number>) => {
      if (pos) {
        onMouseEvent(pos, true);
      }
    },
    [onMouseEvent]
  );

  const onMouseUp = useCallback(
    (pos?: Vec2<number>) => {
      if (pos) {
        onMouseEvent(pos, false);
      }
    },
    [onMouseEvent]
  );

  // Make sure to update the size after the api canvas has been added to the DOM
  useLayoutEffect(() => {
    if (userModel) {
      onResize();
    }
  }, [onResize, userModel]);

  const breakpoint = useBreakpoint();
  const isCompact = breakpoint <= Breakpoint.Sm;

  const width =
    maxSize.width <= maxSize.height * DISPLAY_ASPECT_RATIO || isCompact
      ? maxSize.width
      : maxSize.height * DISPLAY_ASPECT_RATIO;

  return (
    <HomeContent title={`${username}'s Display`}>
      {userModel ? (
        <div className="flex flex-col space-y-4 md:flex-row h-full">
          <div
            ref={wrapperRef}
            className="grow flex flex-row justify-center h-full"
          >
            <motion.div
              className={isCompact ? '' : 'absolute'}
              layoutId={displayLayoutId(username)}
              key={displayLayoutId(username)}
            >
              <Display
                frame={userModel.frame}
                width={width}
                className="rounded-xl"
                cursor={mouseActive ? 'crosshair' : undefined}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseDrag={onMouseDown}
                onMouseMove={onMouseUp}
              />
            </motion.div>
          </div>
          <DisplayInspector
            username={username}
            inputState={inputState}
            inputConfig={inputConfig}
            setInputConfig={setInputConfig}
          />
        </div>
      ) : (
        // TODO: Improve error message, perhaps add a link back to /displays?
        <p>No api found!</p>
      )}
    </HomeContent>
  );
}
