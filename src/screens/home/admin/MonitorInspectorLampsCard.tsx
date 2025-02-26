import { TitledCard } from '@luna/components/TitledCard';
import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { MonitorInspectorValue } from '@luna/screens/home/admin/MonitorInspectorValue';
import {
  Table,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { IconLamp } from '@tabler/icons-react';
import { useMemo } from 'react';
import { TableBody } from 'react-stately';

export interface MonitorInspectorLampsCardProps {
  metrics: LampV2Metrics[];
}

export function MonitorInspectorLampsCard({
  metrics,
}: MonitorInspectorLampsCardProps) {
  const columns = [...Array(metrics.length + 1).keys()].map(i => ({
    key: i,
  }));

  const rows = useMemo(
    () =>
      metrics.length > 0
        ? Object.keys(metrics[0]).map((prop, i) => ({
            key: i,
            lampValues: [
              prop,
              ...metrics.map(lamp => lamp[prop as keyof LampV2Metrics]),
            ],
          }))
        : [],
    [metrics]
  );

  return (
    <TitledCard icon={<IconLamp />} title="Lamps">
      <Table hideHeader isStriped isCompact aria-label="Lamp monitoring values">
        <TableHeader columns={columns}>
          {column => <TableColumn key={column.key}>{column.key}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {item => (
            <TableRow key={item.key}>
              {columnKey => {
                const i = columnKey as number;
                return (
                  <TableCell>
                    <MonitorInspectorValue value={item.lampValues[i]} />
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
