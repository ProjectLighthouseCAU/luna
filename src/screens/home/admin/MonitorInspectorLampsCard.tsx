import { TitledCard } from '@luna/components/TitledCard';
import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { MonitorLampCriterion } from '@luna/screens/home/admin/helpers/MonitorCriterion';
import {
  Names,
  ObjectInspectorTable,
} from '@luna/components/ObjectInspectorTable';
import { ObjectInspectorValue } from '@luna/components/ObjectInspectorValue';
import { IconCheck, IconLamp } from '@tabler/icons-react';

export interface MonitorInspectorLampsCardProps {
  criterion?: MonitorLampCriterion;
  setCriterion: (criterion?: MonitorLampCriterion) => void;
  metrics: LampV2Metrics[];
}

const names: Names<LampV2Metrics> = {
  responding: 'Responding',
  firmware_version: 'Firmware version',
  uptime: 'Uptime',
  timeout: 'Timeout',
  temperature: 'Temperature (not accurate)',
  fuse_tripped: 'Fuse tripped',
  flashing_status: 'Flashing status',
};

export function MonitorInspectorLampsCard({
  criterion,
  setCriterion,
  metrics,
}: MonitorInspectorLampsCardProps) {
  return (
    <TitledCard icon={<IconLamp />} title="Lamps">
      {metrics.length > 0 ? (
        <ObjectInspectorTable
          objects={metrics}
          names={names}
          selection={criterion?.key}
          onSelect={key =>
            setCriterion(key ? { type: 'lamp', key } : undefined)
          }
          render={(value, prop) => (
            <MonitorInspectorLampValue value={value} prop={prop} />
          )}
        />
      ) : (
        <div className="opacity-50">No lamps selected</div>
      )}
    </TitledCard>
  );
}

function MonitorInspectorLampValue<K extends keyof LampV2Metrics>({
  value,
  prop,
}: {
  value: LampV2Metrics[K];
  prop: K;
}) {
  switch (prop) {
    case 'flashing_status':
      switch (value) {
        case 'already up to date':
          return <IconCheck />;
      }
      break;
  }
  return <ObjectInspectorValue value={value} />;
}
