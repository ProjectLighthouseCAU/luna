import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useEventListener } from '@luna/hooks/useEventListener';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { throttle } from '@luna/utils/schedule';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { useMemo, useRef, useState } from 'react';

export function MonitorView() {
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

  useEventListener(window, 'resize', onResize, { fireImmediately: true });

  const breakpoint = useBreakpoint();
  const isCompact = breakpoint <= Breakpoint.Sm;

  const width =
    maxSize.width <= maxSize.height * DISPLAY_ASPECT_RATIO || isCompact
      ? maxSize.width
      : maxSize.height * DISPLAY_ASPECT_RATIO;

  // TODO: somehow get the huge JSON object from LaSer streamed through Beacon into here
  // then set the color of a pixel according to the state of the lamp/network-controller
  // e.g. green: ok, yellow: lamp missing, red: room missing (or whatever)
  // TODO: add an overlay to show all metrics when hovering/clicking a window/room
  // maybe also show room boundaries e.g. alternating color shades
  const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);
  for (let i = 0; i < frame.length; i++) {
    frame[i] = 255;
  }
  return (
    <HomeContent title="Monitor">
      <div className="flex flex-col space-y-4 md:flex-row h-full">
        <div
          ref={wrapperRef}
          className="grow flex flex-row justify-center h-full"
        >
          <div className={isCompact ? '' : 'absolute'}>
            <Display width={width} frame={frame} />
          </div>
        </div>
      </div>
    </HomeContent>
  );
}
