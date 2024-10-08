import { DISPLAY_ASPECT_RATIO } from '@luna/components/Display';
import { displayLayoutId } from '@luna/constants/LayoutId';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useEventListener } from '@luna/hooks/useEventListener';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { DisplayInspector } from '@luna/screens/home/displays/DisplayInspector';
import { DisplayStream } from '@luna/screens/home/displays/DisplayStream';
import { throttle } from '@luna/utils/schedule';
import { motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export function DisplayView() {
  const { username } = useParams() as { username: string };

  const [maxSize, setMaxSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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

  const breakpoint = useBreakpoint();
  const isCompact = breakpoint <= Breakpoint.Sm;

  const width =
    maxSize.width <= maxSize.height * DISPLAY_ASPECT_RATIO || isCompact
      ? maxSize.width
      : maxSize.height * DISPLAY_ASPECT_RATIO;

  return (
    <HomeContent title={`${username}'s Display`}>
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
            <DisplayStream
              username={username}
              width={width}
              className="rounded-xl"
              layoutOnModelUpdate={onResize}
            />
          </motion.div>
        </div>
        <DisplayInspector username={username} />
      </div>
    </HomeContent>
  );
}
