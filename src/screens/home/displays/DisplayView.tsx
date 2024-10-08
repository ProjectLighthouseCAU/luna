import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/ModelContext';
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
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { UserModel } from '@luna/api/model/types';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';

export function DisplayView() {
  const { username } = useParams() as { username: string };
  const model = useContext(ModelContext);

  const [maxSize, setMaxSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [userModel, setUserModel] = useState<UserModel>({
    frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES),
  });

  const streamModel = useCallback(() => {
    console.log(`Streaming ${username}`);

    // We have to clear the frame since React will persist the userModel state
    // even as the route changes if the `<DisplayView />` stays where it is in the
    // DOM (e.g. when switching displays in the sidebar).
    setUserModel({ frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES) });

    return model.streamModel(username);
  }, [model, username]);

  const handleStreamError = useCallback((error: any) => {
    console.warn(`Error while streaming from display view: ${error}`);
  }, []);

  useAsyncIterable(streamModel, setUserModel, handleStreamError);

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

  useEventListener(window, 'resize', onResize);

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
          <DisplayInspector username={username} />
        </div>
      ) : (
        // TODO: Improve error message, perhaps add a link back to /displays?
        <p>No model found!</p>
      )}
    </HomeContent>
  );
}
