import { TitledCard } from '@luna/components/TitledCard';
import { FlatRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';
import { MonitorRoomFilter } from '@luna/screens/home/admin/helpers/MonitorFilter';
import { MonitorInspectorTable } from '@luna/screens/home/admin/MonitorInspectorTable';
import { MonitorInspectorValue } from '@luna/screens/home/admin/MonitorInspectorValue';
import { IconDoor } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

export interface MonitorInspectorRoomCardProps {
  filter?: MonitorRoomFilter;
  setFilter: (filter?: MonitorRoomFilter) => void;
  metrics?: FlatRoomV2Metrics;
}

const names: { [Property in keyof FlatRoomV2Metrics]?: string } = {
  api_version: 'API version',
  responsive_lamps: 'Lamps (responsive)',
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

const units: { [Property in keyof FlatRoomV2Metrics]?: string } = {
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
  const [selection, setSelection] = useState<keyof FlatRoomV2Metrics>();
  const renderedMetrics = useMemo<FlatRoomV2Metrics[]>(
    () => (metrics ? [metrics] : []),
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

function MonitorInspectorRoomValue<K extends keyof FlatRoomV2Metrics>({
  value,
  prop,
}: {
  value: FlatRoomV2Metrics[K];
  prop: K;
}) {
  return <MonitorInspectorValue value={value} unit={units[prop]} />;
}
