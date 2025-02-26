import { MonitorInspectorValue } from '@luna/screens/home/admin/MonitorInspectorValue';
import { Table, TableCell, TableColumn, TableRow } from '@nextui-org/react';
import { useMemo } from 'react';
import { TableBody, TableHeader } from 'react-stately';

// TODO: Generalize this to a generic component for data tables?

export interface MonitorInspectorTableProps<T> {
  metrics: T[];
  names: { [Property in keyof T]: string };
}

export function MonitorInspectorTable<T extends object>({
  metrics,
  names,
}: MonitorInspectorTableProps<T>) {
  const columns = [...Array(metrics.length + 1).keys()].map(i => ({
    key: i,
  }));

  const rows = useMemo(
    () =>
      metrics.length > 0
        ? (Object.keys(metrics[0]) as (keyof T)[]).map((prop, i) => ({
            key: i,
            values: [names[prop], ...metrics.map(v => v[prop])],
          }))
        : [],
    [metrics, names]
  );

  return (
    <Table
      hideHeader
      classNames={{
        table: 'bg-red',
      }}
      isStriped
      isCompact
      aria-label="Lamp monitoring values"
    >
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
                  <MonitorInspectorValue value={item.values[i]} />
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
