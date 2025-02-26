import { TitledCard } from '@luna/components/TitledCard';
import { RoomV2Metrics } from '@luna/contexts/api/model/types';
import { Chip } from '@nextui-org/react';
import { IconDoor } from '@tabler/icons-react';

export interface MonitorInspectorRoomCardProps {
  metrics?: RoomV2Metrics;
}

export function MonitorInspectorRoomCard({
  metrics,
}: MonitorInspectorRoomCardProps) {
  return (
    <TitledCard icon={<IconDoor />} title={`Room ${metrics?.room ?? ''}`}>
      {metrics ? (
        <>
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
        </>
      ) : (
        <></>
      )}
    </TitledCard>
  );
}
