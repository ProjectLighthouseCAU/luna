import { TitledCard } from '@luna/components/TitledCard';
import {
  ControllerV2Metrics,
  RoomV2Metrics,
} from '@luna/contexts/api/model/types';
import { MonitorInspectorTable } from '@luna/screens/home/admin/MonitorInspectorTable';
import { MonitorInspectorValue } from '@luna/screens/home/admin/MonitorInspectorValue';
import { IconDoor } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

export interface MonitorInspectorRoomCardProps {
  metrics?: RoomV2Metrics;
}

interface RenderedMetrics extends ControllerV2Metrics {
  api_version: number;
  lamps: string;
}

const names: { [Property in keyof RenderedMetrics]: string } = {
  api_version: 'API version',
  lamps: 'Lamps',
  board_temperature: 'Board temperature (accurate)',
  core_temperature: 'Core temperature (not accurate)',
  current: 'Current',
  firmware_version: 'Firmware version',
  fps: 'FPS',
  frames: 'Frames received (total)',
  ping_latency_ms: 'Ping/latency',
  power: 'Power',
  responding: 'Responding',
  shunt_voltage: 'Shunt voltage',
  uptime: 'Uptime',
  voltage: 'Voltage',
};

const units: { [Property in keyof RenderedMetrics]?: string } = {
  board_temperature: '°C',
  core_temperature: '°C',
  current: 'A',
  ping_latency_ms: 'ms',
  power: 'W',
  uptime: 's',
  voltage: 'V',
};

export function MonitorInspectorRoomCard({
  metrics,
}: MonitorInspectorRoomCardProps) {
  const [selection, setSelection] = useState<keyof RenderedMetrics>();
  const renderedMetrics = useMemo<RenderedMetrics[]>(
    () =>
      metrics
        ? [
            {
              api_version: metrics.api_version,
              lamps: `${metrics.lamp_metrics.filter(l => l.responding).length} of ${metrics.lamp_metrics.length}`,
              ...metrics.controller_metrics,
            },
          ]
        : [],
    [metrics]
  );

  return (
    <TitledCard icon={<IconDoor />} title={`Room ${metrics?.room ?? ''}`}>
      {metrics ? (
        <MonitorInspectorTable
          metrics={renderedMetrics}
          names={names}
          selection={selection}
          onSelect={setSelection}
          render={(value, prop) => (
            <MonitorInspectorRoomValue value={value} prop={prop} />
          )}
        />
      ) : (
        <div className="opacity-50">No room selected</div>
      )}
    </TitledCard>
  );
}

function MonitorInspectorRoomValue<K extends keyof RenderedMetrics>({
  value,
  prop,
}: {
  value: RenderedMetrics[K];
  prop: K;
}) {
  return <MonitorInspectorValue value={value} unit={units[prop]} />;
}
