import { RoomV2Metrics } from '@luna/contexts/api/model/types';
import { Card, CardBody, CardHeader, Chip } from '@nextui-org/react';

export interface MonitorInspectorProps {
  metrics?: RoomV2Metrics;
}

export function MonitorInspector({ metrics }: MonitorInspectorProps) {
  return (
    <>
      <Card className="p-2 m-2 min-w-[420px] h-fit">
        {metrics ? (
          <>
            <CardHeader>
              <b>Room {metrics.room}</b>
            </CardHeader>
            <CardBody>
              <div>API-Version: {metrics.api_version}</div>
              <div>
                Responding:
                {metrics.controller_metrics.responding ? (
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
                {metrics.controller_metrics.ping_latency_ms}ms
              </div>
              <div>
                Firmware-Version:
                {metrics.controller_metrics.firmware_version}
              </div>
              <div>Uptime: {metrics.controller_metrics.uptime}s</div>
              <div>
                Frames received (total):
                {metrics.controller_metrics.frames}
              </div>
              <div>
                Current frames per second (FPS):
                {metrics.controller_metrics.fps}
              </div>
              <div>
                Core temperature (not very accurate):
                {metrics.controller_metrics.core_temperature}
                °C
              </div>
              <div>
                Board temperature (accurate):
                {metrics.controller_metrics.board_temperature}
                °C
              </div>
              <div>
                Shunt voltage:
                {metrics.controller_metrics.shunt_voltage}V
              </div>
              <div>Voltage: {metrics.controller_metrics.voltage}V</div>
              <div>Power: {metrics.controller_metrics.power}W</div>
              <div>Current: {metrics.controller_metrics.current}A</div>
              <div>
                Number of lamps responding/connected:{' '}
                {metrics.lamp_metrics.reduce(
                  (a: number, v: any) => a + (v.responding ? 1 : 0),
                  0
                )}
                /{metrics.lamp_metrics.length}
              </div>
            </CardBody>
          </>
        ) : (
          <></>
        )}
      </Card>
      <Card className="p-2 m-2 min-w-[320px] h-fit">
        {metrics ? (
          <>
            <CardHeader>
              <b>Lamps:</b>
            </CardHeader>
            <CardBody>
              {metrics.lamp_metrics.map((lamp: any, idx: number) => (
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
              ))}
            </CardBody>
          </>
        ) : (
          <></>
        )}
      </Card>
    </>
  );
}
