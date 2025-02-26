import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { LaserMetrics, RoomV2Metrics } from '@luna/contexts/api/model/types';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useEventListener } from '@luna/hooks/useEventListener';
import { flattenRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';
import { MonitorFilter } from '@luna/screens/home/admin/helpers/MonitorFilter';
import { MonitorInspector } from '@luna/screens/home/admin/MonitorInspector';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { throttle } from '@luna/utils/schedule';
import { Vec2 } from '@luna/utils/vec2';
import { Button } from '@heroui/react';
import { IconRefresh } from '@tabler/icons-react';
import { Set } from 'immutable';
import {
  LIGHTHOUSE_COLOR_CHANNELS,
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_FRAME_BYTES,
} from 'nighthouse/browser';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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

  const model = useContext(ModelContext);
  const [metrics, setMetrics] = useState<LaserMetrics>();

  const [focusedRoom, setSelectedRoom] = useState<number>();
  const [hoveredRoom, setHoveredRoom] = useState<number>();
  const [filter, setFilter] = useState<MonitorFilter>({
    type: 'lamp',
    key: 'responding',
  });

  const getLatestMetrics = useCallback(async () => {
    // setMetrics(testMetrics); // TODO: change back from test data to fetched data
    const m = await model.getLaserMetrics(); // TODO: stream metrics instead
    if (m.ok) {
      setMetrics(m.value);
    } else {
      console.log(m.error);
    }
  }, [model]);

  // get the metrics on load
  useEffect(() => {
    getLatestMetrics();
  }, [getLatestMetrics]);

  const roomMetrics = useMemo(
    () => (metrics?.rooms ?? []) as RoomV2Metrics[],
    [metrics?.rooms]
  );

  const flatRoomMetrics = useMemo(
    () => roomMetrics.map(room => flattenRoomV2Metrics(room)),
    [roomMetrics]
  );

  const filteredValues = useMemo(() => {
    switch (filter.type) {
      case 'room':
        return flatRoomMetrics.map(room => room[filter.key]);
      case 'lamp':
        return roomMetrics.flatMap(room =>
          room.lamp_metrics.map(lamp => lamp[filter.key])
        );
    }
  }, [filter, flatRoomMetrics, roomMetrics]);

  // fill the frame with colors according to the metrics data
  const frame = useMemo(() => {
    const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);
    // alternate between light and dark color to visualize room borders
    let parity = false;
    let i = 0;
    for (const room of roomMetrics) {
      if (room.api_version !== 2) continue;
      const endIdx = i + LIGHTHOUSE_COLOR_CHANNELS * room.lamp_metrics.length;
      // controller works?
      if (room.controller_metrics.responding) {
        let lampIdx = 0;
        for (; i < endIdx; i += LIGHTHOUSE_COLOR_CHANNELS) {
          // lamp works?
          if (room.lamp_metrics[lampIdx].responding) {
            frame[i + 1] = parity ? 255 : 128; // green
          } else {
            // lamp down -> magenta
            frame[i] = parity ? 255 : 128;
            frame[i + 2] = parity ? 255 : 128;
          }
          lampIdx++;
        }
      } else {
        // controller down
        for (; i < endIdx; i += 3) {
          frame[i] = parity ? 255 : 128; // red
        }
      }
      parity = !parity;
    }

    return frame;
  }, [roomMetrics]);

  const [roomsByWindow, windowsByRoom] = useMemo<[number[], number[][]]>(() => {
    const roomsByWindow: number[] = [];
    const windowsByRoom: number[][] = [];
    let windowIdx = 0;
    let roomIdx = 0;
    for (const room of roomMetrics) {
      for (let i = 0; i < room.lamp_metrics.length; i++) {
        roomsByWindow[windowIdx] = roomIdx;
        windowsByRoom[roomIdx] = [...(windowsByRoom[roomIdx] ?? []), windowIdx];
        windowIdx++;
      }
      roomIdx++;
    }
    return [roomsByWindow, windowsByRoom];
  }, [roomMetrics]);

  const windowForPosition = useCallback(
    (p: Vec2<number>) => Math.floor(p.y) * LIGHTHOUSE_COLS + Math.floor(p.x),
    []
  );

  const roomForPosition = useCallback(
    (p?: Vec2<number>) => (p ? roomsByWindow[windowForPosition(p)] : undefined),
    [roomsByWindow, windowForPosition]
  );

  // set the selected window index on click
  const onMouseDown = useCallback(
    (p: Vec2<number>) => setSelectedRoom(roomForPosition(p)),
    [roomForPosition]
  );

  const onMouseMove = useCallback(
    (p?: Vec2<number>) => setHoveredRoom(roomForPosition(p)),
    [roomForPosition]
  );

  const focusedWindows = useMemo<Set<number>>(
    () => (focusedRoom !== undefined ? Set(windowsByRoom[focusedRoom]) : Set()),
    [focusedRoom, windowsByRoom]
  );

  const hoveredWindows = useMemo<Set<number>>(
    () => (hoveredRoom !== undefined ? Set(windowsByRoom[hoveredRoom]) : Set()),
    [hoveredRoom, windowsByRoom]
  );

  // get the selected rooms metrics for rendering
  const [focusedFlatRoomMetrics, focusedLampMetrics] = useMemo(
    () =>
      focusedRoom !== undefined
        ? [flatRoomMetrics[focusedRoom], roomMetrics[focusedRoom].lamp_metrics]
        : [undefined, undefined],
    [flatRoomMetrics, roomMetrics, focusedRoom]
  );

  // TODO: more appealing UI (maybe tables, inputs or custom stuff?)
  return (
    <HomeContent
      title="Monitoring"
      toolbar={
        /* TODO: auto-refresh (polling) or streaming metrics */
        <Button color="secondary" onPress={getLatestMetrics}>
          <IconRefresh />
          Refresh all
        </Button>
      }
    >
      <div className="flex flex-col space-y-4 md:flex-row h-full">
        <div
          ref={wrapperRef}
          className="grow flex flex-row justify-center h-full"
        >
          <div className={isCompact ? '' : 'absolute'}>
            <Display
              width={width}
              frame={frame}
              highlightedWindows={hoveredWindows}
              focusedWindows={focusedWindows}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
            />
          </div>
        </div>
        <div
          className={isCompact ? '' : 'flex flex-row justify-end grow-0 w-1/3'}
        >
          <MonitorInspector
            filter={filter}
            setFilter={setFilter}
            flatRoomMetrics={focusedFlatRoomMetrics}
            lampMetrics={focusedLampMetrics}
          />
        </div>
      </div>
    </HomeContent>
  );
}
