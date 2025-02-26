import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useEventListener } from '@luna/hooks/useEventListener';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { throttle } from '@luna/utils/schedule';
import { Vec2 } from '@luna/utils/vec2';
import { Button, Card, CardBody, CardHeader, Chip } from '@nextui-org/react';
import {
  LIGHTHOUSE_COLOR_CHANNELS,
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_FRAME_BYTES,
} from 'nighthouse/browser';
// import {
//   LaserMetrics,
//   RoomMetrics,
//   RoomV2Metrics,
// } from 'nighthouse/out/common/protocol/metrics';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Set } from 'immutable';
import { LaserMetrics, RoomV2Metrics } from '@luna/contexts/api/model/types';
// import testMetrics from './statusLamps.json'; // TODO: remove testMetrics

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

  const [selectedWindows, setSelectedWindows] = useState<Set<number>>(Set());
  const [hoveredWindows, setHoveredWindows] = useState<Set<number>>(Set());

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

  // fill the frame with colors according to the metrics data
  const frame = useMemo(() => {
    const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);
    if (!metrics || !metrics.rooms) {
      return frame;
    }
    // alternate between light and dark color to visualize room borders
    let parity = false;
    let i = 0;
    for (const room of metrics!.rooms!) {
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

    const highlight = (window: number, brightness: number) => {
      const i = window * LIGHTHOUSE_COLOR_CHANNELS;
      for (let c = 0; c < LIGHTHOUSE_COLOR_CHANNELS; c++) {
        frame[i + c] = (1 - brightness) * frame[i + c] + brightness * 255;
      }
    };

    for (const selectedWindow of selectedWindows) {
      highlight(selectedWindow, 0.5);
    }

    return frame;
  }, [metrics, selectedWindows]);

  const [roomsByWindow, windowsByRoom] = useMemo<[number[], number[][]]>(() => {
    const roomsByWindow: number[] = [];
    const windowsByRoom: number[][] = [];
    let windowIdx = 0;
    let roomIdx = 0;
    for (const room of metrics?.rooms ?? []) {
      const roomV2 = room as RoomV2Metrics;
      for (let i = 0; i < roomV2.lamp_metrics.length; i++) {
        roomsByWindow[windowIdx] = roomIdx;
        windowsByRoom[roomIdx] = [...(windowsByRoom[roomIdx] ?? []), windowIdx];
        windowIdx++;
      }
      roomIdx++;
    }
    return [roomsByWindow, windowsByRoom];
  }, [metrics?.rooms]);

  const windowForPosition = useCallback(
    (p: Vec2<number>) => Math.floor(p.y) * LIGHTHOUSE_COLS + Math.floor(p.x),
    []
  );

  const roomWindowsForWindow = useCallback(
    (windowIdx: number) => windowsByRoom[roomsByWindow[windowIdx]],
    [roomsByWindow, windowsByRoom]
  );

  const roomMetricsForWindow = useCallback(
    (windowIdx: number) => {
      if (!metrics) return null;
      return metrics.rooms[roomsByWindow[windowIdx]] as RoomV2Metrics;
    },
    [metrics, roomsByWindow]
  );

  const roomWindowsForPosition = useCallback(
    (p?: Vec2<number>) => (p ? roomWindowsForWindow(windowForPosition(p)) : []),
    [roomWindowsForWindow, windowForPosition]
  );

  // set the selected window index on click
  const onMouseDown = useCallback(
    (p: Vec2<number>) => setSelectedWindows(Set(roomWindowsForPosition(p))),
    [roomWindowsForPosition]
  );

  const onMouseMove = useCallback(
    (p?: Vec2<number>) => setHoveredWindows(Set(roomWindowsForPosition(p))),
    [roomWindowsForPosition]
  );

  // get the selected rooms metrics for rendering
  const selectedRoomMetrics = useMemo(
    () =>
      !selectedWindows.isEmpty()
        ? (roomMetricsForWindow(selectedWindows.first()) as RoomV2Metrics)
        : undefined,
    [roomMetricsForWindow, selectedWindows]
  );

  // TODO: more appealing UI (maybe tables, inputs or custom stuff?)
  return (
    <HomeContent
      title="Monitoring"
      toolbar={
        /* TODO: auto-refresh (polling) or streaming metrics */
        <Button
          color="secondary"
          className="flex flex-col"
          onPress={getLatestMetrics}
        >
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
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
            />
          </div>
        </div>
        <>
          <Card className="p-2 m-2 min-w-[420px] h-fit">
            {selectedRoomMetrics ? (
              <>
                <CardHeader>
                  <b>Room {selectedRoomMetrics.room}</b>
                </CardHeader>
                <CardBody>
                  <div>API-Version: {selectedRoomMetrics.api_version}</div>
                  <div>
                    Responding:
                    {selectedRoomMetrics.controller_metrics.responding ? (
                      <Chip color="success" variant="flat">
                        true
                      </Chip>
                    ) : (
                      <Chip color="danger" variant="flat">
                        false
                      </Chip>
                    )}
                  </div>
                  <div>
                    Ping Latency:
                    {selectedRoomMetrics.controller_metrics.ping_latency_ms}ms
                  </div>
                  <div>
                    Firmware-Version:
                    {selectedRoomMetrics.controller_metrics.firmware_version}
                  </div>
                  <div>
                    Uptime: {selectedRoomMetrics.controller_metrics.uptime}s
                  </div>
                  <div>
                    Frames received (total):
                    {selectedRoomMetrics.controller_metrics.frames}
                  </div>
                  <div>
                    Current frames per second (FPS):
                    {selectedRoomMetrics.controller_metrics.fps}
                  </div>
                  <div>
                    Core temperature (not very accurate):
                    {selectedRoomMetrics.controller_metrics.core_temperature}
                    °C
                  </div>
                  <div>
                    Board temperature (accurate):
                    {selectedRoomMetrics.controller_metrics.board_temperature}
                    °C
                  </div>
                  <div>
                    Shunt voltage:
                    {selectedRoomMetrics.controller_metrics.shunt_voltage}V
                  </div>
                  <div>
                    Voltage: {selectedRoomMetrics.controller_metrics.voltage}V
                  </div>
                  <div>
                    Power: {selectedRoomMetrics.controller_metrics.power}W
                  </div>
                  <div>
                    Current: {selectedRoomMetrics.controller_metrics.current}A
                  </div>
                  <div>
                    Number of lamps responding/connected:{' '}
                    {selectedRoomMetrics.lamp_metrics.reduce(
                      (a: number, v: any) => a + (v.responding ? 1 : 0),
                      0
                    )}
                    /{selectedRoomMetrics.lamp_metrics.length}
                  </div>
                </CardBody>
              </>
            ) : (
              <></>
            )}
          </Card>
          <Card className="p-2 m-2 min-w-[320px] h-fit">
            {selectedRoomMetrics ? (
              <>
                <CardHeader>
                  <b>Lamps:</b>
                </CardHeader>
                <CardBody>
                  {selectedRoomMetrics.lamp_metrics.map(
                    (lamp: any, idx: number) => (
                      <>
                        <div>
                          <br />
                          <b>Lamp {idx + 1}:</b>
                          <div>
                            Responding:{' '}
                            {lamp.responding ? (
                              <Chip color="success" variant="flat">
                                true
                              </Chip>
                            ) : (
                              <Chip color="danger" variant="flat">
                                false
                              </Chip>
                            )}
                          </div>
                          <div>Firmware-Version: {lamp.firmware_version}</div>
                          <div>Uptime (not very accurate): {lamp.uptime}s</div>
                          <div>Timeout: {lamp.timeout}s</div>
                          <div>
                            Temperature (not very accurate): {lamp.temperature}
                            °C
                          </div>
                          <div>
                            Fuse tripped?{' '}
                            {lamp.fuse_tripped ? (
                              <Chip color="danger" variant="flat">
                                Yes
                              </Chip>
                            ) : (
                              <Chip color="success" variant="flat">
                                No
                              </Chip>
                            )}
                          </div>
                          <div>Flashing status: {lamp.flashing_status}</div>
                        </div>
                      </>
                    )
                  )}
                </CardBody>
              </>
            ) : (
              <></>
            )}
          </Card>
        </>
      </div>
    </HomeContent>
  );
}
