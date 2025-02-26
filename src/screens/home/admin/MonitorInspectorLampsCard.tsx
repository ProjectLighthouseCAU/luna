import { TitledCard } from '@luna/components/TitledCard';
import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { MonitorInspectorTable } from '@luna/screens/home/admin/MonitorInspectorTable';
import { MonitorInspectorValue } from '@luna/screens/home/admin/MonitorInspectorValue';
import { IconLamp } from '@tabler/icons-react';

export interface MonitorInspectorLampsCardProps {
  metrics: LampV2Metrics[];
}

const names: { [Property in keyof LampV2Metrics]: string } = {
  firmware_version: 'Firmware version',
  flashing_status: 'Flashing status',
  fuse_tripped: 'Fuse tripped',
  responding: 'Responding',
  temperature: 'Temperature',
  timeout: 'Timeout',
  uptime: 'Uptime',
};

export function MonitorInspectorLampsCard({
  metrics,
}: MonitorInspectorLampsCardProps) {
  return (
    <TitledCard icon={<IconLamp />} title="Lamps">
      {metrics.length > 0 ? (
        <MonitorInspectorTable
          metrics={metrics}
          names={names}
          render={value => <MonitorInspectorValue value={value} />}
        />
      ) : (
        <div className="opacity-50">No lamps selected</div>
      )}
    </TitledCard>
  );
}
