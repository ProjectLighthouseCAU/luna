import { TitledCard } from '@luna/components/TitledCard';
import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { MonitorLampCriterion } from '@luna/screens/home/admin/helpers/MonitorCriterion';
import {
  Names,
  ObjectInspectorTable,
} from '@luna/components/ObjectInspectorTable';
import { ObjectInspectorValue } from '@luna/components/ObjectInspectorValue';
import { IconCheck, IconLamp } from '@tabler/icons-react';
import { TimeInterval } from '@luna/components/TimeInterval';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';

export interface MonitorInspectorLampsCardProps {
  criterion?: MonitorLampCriterion;
  setCriterion: (criterion?: MonitorLampCriterion) => void;
  metrics: LampV2Metrics[];
  padLampCount: number;
}

const names: Names<LampV2Metrics> = {
  responding: 'Responding',
  firmware_version: 'Firmware version',
  uptime: 'Uptime',
  timeout: 'Timeout',
  temperature: 'Temperature (inaccurate)',
  fuse_tripped: 'Fuse tripped',
  flashing_status: 'Flashing status',
};

export function MonitorInspectorLampsCard({
  criterion,
  setCriterion,
  metrics,
  padLampCount,
}: MonitorInspectorLampsCardProps) {
  const [isCollapsed, storeCollapsed] = useLocalStorage(
    LocalStorageKey.MonitorInspectorLampsCollapsed,
    () => false
  );

  const paddedMetrics: (LampV2Metrics | null)[] = [...metrics];
  while (paddedMetrics.length < padLampCount) {
    paddedMetrics.push(null);
  }

  return (
    <TitledCard
      icon={<IconLamp />}
      title="Lamps"
      isCollapsible
      initiallyCollapsed={isCollapsed}
      onSetCollapsed={storeCollapsed}
    >
      {metrics.length > 0 ? (
        <div>
          <ObjectInspectorTable
            objects={paddedMetrics}
            names={names}
            labelWidth={150}
            selection={criterion?.key}
            onSelect={key =>
              setCriterion(key ? { type: 'lamp', key } : undefined)
            }
            render={(value, prop) => (
              <MonitorInspectorLampValue value={value} prop={prop} />
            )}
          />
        </div>
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
    case 'uptime':
      return <TimeInterval seconds={value as number} layout="vertical" />;
  }
  return <ObjectInspectorValue value={value} />;
}
