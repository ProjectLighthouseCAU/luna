import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useEventListener } from '@luna/hooks/useEventListener';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { DisplayInspector } from '@luna/screens/home/displays/DisplayInspector';
import { throttle } from '@luna/utils/schedule';
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { displayLayoutId } from '@luna/constants/LayoutId';
import { InputConfig } from '@luna/screens/home/displays/helpers/InputConfig';
import { InputState } from '@luna/screens/home/displays/helpers/InputState';
import { ClientIdContext } from '@luna/contexts/env/ClientIdContext';
import { KeyEvent, LegacyKeyEvent } from 'nighthouse/browser';

export function DisplayView() {
  const { username } = useParams() as { username: string };

  const { clientId } = useContext(ClientIdContext);

  const model = useContext(ModelContext);
  const { users } = model;

  const [inputState, setInputState] = useState<InputState>({});
  const [inputConfig, setInputConfig] = useState<InputConfig>({
    legacyMode: true,
    mouseEnabled: true,
    keyboardEnabled: true,
    controllerEnabled: true,
  });

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
          src: 0, // TODO: What is this?
          dwn: down,
          key: e.keyCode,
        };
        await model.putLegacyInput(username, event);
        setInputState(state => ({ ...state, lastKeyEvent: event }));
      } else {
        const event: KeyEvent = {
          type: 'key',
          source: clientId,
          down,
          key: e.key,
        };
        await model.putInput(username, event);
        setInputState(state => ({ ...state, lastKeyEvent: event }));
      }
    },
    [
      clientId,
      inputConfig.keyboardEnabled,
      inputConfig.legacyMode,
      model,
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

  // Make sure to update the size after the model canvas has been added to the DOM
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
        <p>No model found!</p>
      )}
    </HomeContent>
  );
}
