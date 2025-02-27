import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { LaserMetrics, RoomV2Metrics } from '@luna/contexts/api/model/types';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useEventListener } from '@luna/hooks/useEventListener';
import { flattenRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';
import { MonitorFilter } from '@luna/screens/home/admin/helpers/MonitorFilter';
import { MonitorInspector } from '@luna/screens/home/admin/MonitorInspector';
import { HomeContent } from '@luna/screens/home/HomeContent';
import * as rgb from '@luna/utils/rgb';
import { throttle } from '@luna/utils/schedule';
import { Vec2 } from '@luna/utils/vec2';
import { Button } from '@heroui/react';
import { IconRefresh } from '@tabler/icons-react';
import { Set } from 'immutable';
import { LIGHTHOUSE_COLS, LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Bounded, isBounded } from '@luna/utils/bounded';

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
  const [filter, setFilter] = useState<MonitorFilter>();

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
    () =>
      (metrics?.rooms ?? []).filter(
        room => room.api_version === 2
      ) as RoomV2Metrics[],
    [metrics?.rooms]
  );

  const flatRoomMetrics = useMemo(
    () => roomMetrics.map(room => flattenRoomV2Metrics(room)),
    [roomMetrics]
  );

  const valueToNumberOrNull = useCallback(
    (value: number | string | boolean | Bounded<number> | null | undefined) => {
      if (value === null || value === undefined) {
        return null;
      }
      if (typeof value === 'object' && isBounded(value)) {
        return value.value;
      }
      return +value;
    },
    []
  );

  const filteredValues = useMemo(() => {
    if (filter === undefined) return undefined;
    switch (filter.type) {
      case 'room':
        return flatRoomMetrics.flatMap(room =>
          [...Array(room.responsive_lamps.total)].map(() =>
            valueToNumberOrNull(room[filter.key])
          )
        );
      case 'lamp':
        return roomMetrics.flatMap(room =>
          room.lamp_metrics.map(lamp => valueToNumberOrNull(lamp[filter.key]))
        );
    }
  }, [filter, flatRoomMetrics, roomMetrics, valueToNumberOrNull]);

  const filteredNormalizedValues = useMemo(() => {
    if (filteredValues === undefined) return undefined;
    if (filteredValues.length === 0) return [];
    const nonNulls = filteredValues.filter(v => v !== null) as number[];
    const min = nonNulls.reduce((x, y) => Math.min(x, y));
    const max = nonNulls.reduce((x, y) => Math.max(x, y));
    return filteredValues.map(x => (x === null ? 0 : (x - min) / (max - min)));
  }, [filteredValues]);

  const filterColormap = useMemo(() => {
    if (filter !== undefined) {
      switch (filter.type) {
        case 'room':
          switch (filter.key) {
            case 'board_temperature':
            case 'core_temperature':
              return [rgb.BLUE, rgb.RED];
            case 'responding':
              return [rgb.GREEN, rgb.RED];
          }
          break;
        case 'lamp':
          switch (filter.key) {
            case 'responding':
            case 'fuse_tripped':
              return [rgb.GREEN, rgb.RED];
          }
          break;
      }
    }
    return [rgb.BLACK, rgb.RED, rgb.YELLOW, rgb.WHITE];
  }, [filter]);

  // fill the frame with colors according to the metrics data
  const frame = useMemo(() => {
    const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);
    let windowIdx = 0;

    const hasValidFilter = filteredNormalizedValues !== undefined;

    if (hasValidFilter) {
      for (const value of filteredNormalizedValues as number[]) {
        const color = rgb.lerpMultiple(filterColormap, value);
        rgb.setAt(windowIdx, color, frame);
        windowIdx++;
      }
    } else {
      // alternate between light and dark color to visualize room borders
      let parity = false;
      const parityDim = (c: rgb.Color) => rgb.scale(c, parity ? 1 : 0.6);
      for (const room of roomMetrics) {
        const lampCount = room.lamp_metrics.length;
        // controller works?
        if (room.controller_metrics.responding) {
          for (let lampIdx = 0; lampIdx < lampCount; lampIdx++) {
            // lamp works?
            const color = parityDim(
              room.lamp_metrics[lampIdx].responding ? rgb.GREEN : rgb.MAGENTA
            );
            rgb.setAt(windowIdx + lampIdx, color, frame);
          }
        } else {
          // controller down
          rgb.fillAt(windowIdx, lampCount, parityDim(rgb.RED), frame);
        }
        windowIdx += lampCount;
        parity = !parity;
      }
    }

    return frame;
  }, [filterColormap, filteredNormalizedValues, roomMetrics]);

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
