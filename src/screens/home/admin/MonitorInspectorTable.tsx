import { Table, TableCell, TableColumn, TableRow } from '@nextui-org/react';
import { ReactNode, useMemo } from 'react';
import { TableBody, TableHeader } from 'react-stately';

// TODO: Generalize this to a generic component for data tables?

export interface MonitorInspectorTableProps<T> {
  metrics: T[];
  names: { [Property in keyof T]: string };
  render: <K extends keyof T>(value: T[K], prop: K) => ReactNode;
}

export function MonitorInspectorTable<T extends object>({
  metrics,
  names,
  render,
}: MonitorInspectorTableProps<T>) {
  const columns = useMemo(
    () =>
      [...Array(metrics.length + 1).keys()].map(i => ({
        key: `${i}`,
      })),
    [metrics.length]
  );

  const rows = useMemo(
    () =>
      metrics.length > 0
        ? (Object.keys(metrics[0]) as (keyof T)[]).map((prop, i) => ({
            key: i,
            prop,
            values: [names[prop], ...metrics.map(v => v[prop])] as [
              string,
              ...T[keyof T][],
            ],
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
              const i = parseInt(columnKey as string);
              return (
                <TableCell>
                  {i === 0
                    ? item.values[0]
                    : render(item.values[i] as T[keyof T], item.prop)}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
