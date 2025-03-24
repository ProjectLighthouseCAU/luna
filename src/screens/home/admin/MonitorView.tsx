import {
  DISPLAY_ASPECT_RATIO,
  Display,
  DisplayMouse,
} from '@luna/components/Display';
import { RoomV2Metrics } from '@luna/contexts/api/model/types';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useEventListener } from '@luna/hooks/useEventListener';
import { useLaserMetrics } from '@luna/hooks/useLaserMetrics';
import { flattenRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';
import { MonitorCriterion } from '@luna/screens/home/admin/helpers/MonitorCriterion';
import { MonitorInspector } from '@luna/screens/home/admin/MonitorInspector';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { Bounded, isBounded } from '@luna/utils/bounded';
import * as rgb from '@luna/utils/rgb';
import { throttle } from '@luna/utils/schedule';
import { Vec2 } from '@luna/utils/vec2';
import { Set } from 'immutable';
import { LIGHTHOUSE_COLS, LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { useCallback, useMemo, useRef, useState } from 'react';

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

  const metrics = useLaserMetrics();

  const [focusedRoom, setSelectedRoom] = useState<number>();
  const [hoveredRoom, setHoveredRoom] = useState<number>();
  const [criterion, setCriterion] = useState<MonitorCriterion>();

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

  const criterionValues = useMemo(() => {
    if (criterion === undefined) return undefined;
    switch (criterion.type) {
      case 'room':
        return flatRoomMetrics.flatMap(room =>
          [...Array(room.responsive_lamps.total)].map(() =>
            valueToNumberOrNull(room[criterion.key])
          )
        );
      case 'lamp':
        return roomMetrics.flatMap(room =>
          room.lamp_metrics.map(lamp =>
            valueToNumberOrNull(lamp[criterion.key])
          )
        );
    }
  }, [criterion, flatRoomMetrics, roomMetrics, valueToNumberOrNull]);

  const normalizedCriterionValues = useMemo(() => {
    if (criterionValues === undefined) return undefined;
    if (criterionValues.length === 0) return [];
    const nonNulls = criterionValues.filter(v => v !== null) as number[];
    const min = nonNulls.reduce((x, y) => Math.min(x, y));
    const max = nonNulls.reduce((x, y) => Math.max(x, y));
    return criterionValues.map(x => (x === null ? 0 : (x - min) / (max - min)));
  }, [criterionValues]);

  const criterionColormap = useMemo(() => {
    if (criterion !== undefined) {
      switch (criterion.type) {
        case 'room':
          switch (criterion.key) {
            case 'board_temperature':
            case 'core_temperature':
              return [rgb.BLUE, rgb.RED];
            case 'responding':
              return [rgb.GREEN, rgb.RED];
          }
          break;
        case 'lamp':
          switch (criterion.key) {
            case 'responding':
            case 'fuse_tripped':
              return [rgb.GREEN, rgb.RED];
          }
          break;
      }
    }
    return [rgb.BLACK, rgb.RED, rgb.YELLOW, rgb.WHITE];
  }, [criterion]);

  // fill the frame with colors according to the metrics data
  const frame = useMemo(() => {
    const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);
    let windowIdx = 0;

    const hasActiveCriterion = normalizedCriterionValues !== undefined;
    if (hasActiveCriterion) {
      for (const value of normalizedCriterionValues as number[]) {
        const color = rgb.lerpMultiple(criterionColormap, value);
        rgb.setAt(windowIdx, color, frame);
        windowIdx++;
      }
    } else {
      // alternate between light and dark color to visualize room borders
      let parity = false;
      const parityDim = (c: rgb.Color) => rgb.scale(c, parity ? 1 : 0.6);
      for (const room of roomMetrics) {
        const lampCount = room.lamp_metrics.length;
        // api works?
        if (room.controller_metrics.responding) {
          for (let lampIdx = 0; lampIdx < lampCount; lampIdx++) {
            // lamp works?
            const color = parityDim(
              room.lamp_metrics[lampIdx].responding ? rgb.GREEN : rgb.MAGENTA
            );
            rgb.setAt(windowIdx + lampIdx, color, frame);
          }
        } else {
          // api down
          rgb.fillAt(windowIdx, lampCount, parityDim(rgb.RED), frame);
        }
        windowIdx += lampCount;
        parity = !parity;
      }
    }

    return frame;
  }, [criterionColormap, normalizedCriterionValues, roomMetrics]);

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
    (mouse: DisplayMouse) => setSelectedRoom(roomForPosition(mouse.pos)),
    [roomForPosition]
  );

  const onMouseMove = useCallback(
    (mouse?: DisplayMouse) => setHoveredRoom(roomForPosition(mouse?.pos)),
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

  const isColumnLayout = breakpoint < Breakpoint.Xl;

  return (
    <HomeContent title="Monitoring" layout="fullScreen">
      <div className="flex flex-col gap-4 xl:flex-row h-full">
        <div
          ref={wrapperRef}
          className="grow flex flex-row justify-center h-full"
        >
          <div className={isColumnLayout ? '' : 'absolute'}>
            <Display
              width={width}
              frame={frame}
              highlightedWindows={hoveredWindows}
              focusedWindows={focusedWindows}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              cursor="pointer"
            />
          </div>
        </div>
        <div
          className={
            isColumnLayout ? '' : 'flex flex-row justify-end grow-0 xl:w-[45%]'
          }
        >
          <div className={isColumnLayout ? '' : 'overflow-y-scroll'}>
            <MonitorInspector
              criterion={criterion}
              setCriterion={setCriterion}
              flatRoomMetrics={focusedFlatRoomMetrics}
              lampMetrics={focusedLampMetrics}
              padLampCount={isColumnLayout ? 0 : 6}
            />
          </div>
        </div>
      </div>
    </HomeContent>
  );
}
