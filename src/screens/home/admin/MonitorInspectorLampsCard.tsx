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
      <MonitorInspectorTable
        metrics={metrics}
        names={names}
        render={value => <MonitorInspectorValue value={value} />}
      />
      {/* <div className="flex flex-row">
        {metrics
          ? metrics.map((lamp: any, idx: number) => (
              <div key={idx}>
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
            ))
          : undefined}
      </div> */}
    </TitledCard>
  );
}
