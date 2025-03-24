import {
  Names,
  ObjectInspectorTable,
} from '@luna/components/ObjectInspectorTable';
import { TitledCard } from '@luna/components/TitledCard';
import { FlatRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';
import { MonitorRoomCriterion } from '@luna/screens/home/admin/helpers/MonitorCriterion';
import { ObjectInspectorValue } from '@luna/components/ObjectInspectorValue';
import { IconDoor } from '@tabler/icons-react';
import { useMemo } from 'react';
import { TimeInterval } from '@luna/components/TimeInterval';

export interface MonitorInspectorRoomCardProps {
  criterion?: MonitorRoomCriterion;
  setCriterion: (criterion?: MonitorRoomCriterion) => void;
  metrics?: FlatRoomV2Metrics;
}

const names: Names<FlatRoomV2Metrics> = {
  responding: 'Responding',
  pings_without_response: 'Pings without response',
  ping_latency_ms: 'Ping/latency',
  responsive_lamps: 'Lamps (responsive)',
  api_version: 'API version',
  firmware_version: 'Firmware version',
  uptime: 'Uptime',
  frames: 'Frames received (total)',
  fps: 'FPS',
  board_temperature: 'Board temperature (accurate)',
  core_temperature: 'Core temperature (not accurate)',
  voltage: 'Voltage',
  shunt_voltage: 'Shunt voltage',
  current: 'Current',
  power: 'Power',
};

const units: Names<FlatRoomV2Metrics> = {
  board_temperature: '°C',
  core_temperature: '°C',
  current: 'A',
  ping_latency_ms: 'ms',
  power: 'W',
  shunt_voltage: 'V',
  uptime: 's',
  voltage: 'V',
};

export function MonitorInspectorRoomCard({
  criterion,
  setCriterion,
  metrics,
}: MonitorInspectorRoomCardProps) {
  const renderedMetrics = useMemo<FlatRoomV2Metrics[]>(
    () => (metrics ? [metrics] : []),
    [metrics]
  );

  return (
    <TitledCard
      icon={<IconDoor />}
      title={`Room ${metrics?.room ?? ''}`}
      isCollapsible
    >
      {metrics ? (
        <ObjectInspectorTable
          objects={renderedMetrics}
          names={names}
          selection={criterion?.key}
          onSelect={key =>
            setCriterion(key ? { type: 'room', key } : undefined)
          }
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
  switch (prop) {
    case 'uptime':
      return <TimeInterval seconds={value as number} />;
  }
  return <ObjectInspectorValue value={value} unit={units[prop]} />;
}
