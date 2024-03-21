import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/ModelContext';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useEventListener } from '@luna/hooks/useEventListener';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { DisplayInspector } from '@luna/screens/home/displays/DisplayInspector';
import { throttle } from '@luna/utils/schedule';
import { useContext, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export function DisplayView() {
  const { username } = useParams() as { username: string };
  const { users } = useContext(ModelContext);

  const [maxSize, setMaxSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const frame = users.frames.get(username);

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

  useEventListener(window, 'resize', onResize, { fireImmediately: true });

  const breakpoint = useBreakpoint();
  const isCompact = breakpoint <= Breakpoint.Sm;

  const width =
    maxSize.width <= maxSize.height * DISPLAY_ASPECT_RATIO || isCompact
      ? maxSize.width
      : maxSize.height * DISPLAY_ASPECT_RATIO;

  return (
    <HomeContent title={`${username}'s Display`}>
      {frame ? (
        <div className="flex flex-col space-y-4 md:flex-row h-full">
          <div
            ref={wrapperRef}
            className="grow flex flex-row justify-center h-full"
          >
            <div className={isCompact ? '' : 'absolute'}>
              <Display frame={frame} width={width} />
            </div>
          </div>
          {/* TODO: Only display inspector (or options etc.) for current user themselves and admins? */}
          <DisplayInspector />
        </div>
      ) : (
        // TODO: Improve error message, perhaps add a link back to /displays?
        <p>No model found!</p>
      )}
    </HomeContent>
  );
}
