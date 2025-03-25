import {
  Selection,
  Table,
  TableCell,
  TableColumn,
  TableRow,
} from '@heroui/react';
import { ObjectInspectorValue } from '@luna/components/ObjectInspectorValue';
import { ReactNode, useCallback, useMemo } from 'react';
import { TableBody, TableHeader } from 'react-stately';

export type Names<T> = { [Property in keyof T]?: string };

export interface ObjectInspectorTableProps<T extends object> {
  objects: (T | null)[];
  names: Names<T>;
  labelWidth?: number;
  selection?: keyof T;
  onSelect?: (prop?: keyof T) => void;
  render?: <K extends keyof T>(value: T[K], prop: K) => ReactNode;
}

export function ObjectInspectorTable<T extends object>({
  objects,
  names,
  labelWidth,
  selection,
  onSelect,
  render = (value, _prop) => <ObjectInspectorValue value={value} />,
}: ObjectInspectorTableProps<T>) {
  const columns = useMemo(
    () =>
      [...Array(objects.length + 1).keys()].map(i => ({
        key: `${i}`,
      })),
    [objects.length]
  );

  const rows = useMemo(
    () =>
      objects.length > 0
        ? (Object.keys(names) as (keyof T)[]).map(prop => ({
            key: prop as string,
            prop,
            values: [
              names[prop],
              ...objects.map(v => (v === null ? undefined : v[prop])),
            ] as [string, ...T[keyof T][]],
          }))
        : [],
    [objects, names]
  );

  const onSelectionChange = useCallback(
    (selection: Selection) => {
      onSelect?.(
        selection !== 'all' && selection.size > 0
          ? (selection.values().next().value as keyof T)
          : undefined
      );
    },
    [onSelect]
  );

  return (
    <Table
      hideHeader
      layout="fixed"
      classNames={{
        base: 'overflow-y-visible',
        table: 'bg-red',
      }}
      removeWrapper
      isCompact
      selectedKeys={[selection as string]}
      selectionMode={selection || onSelect ? 'single' : undefined}
      onSelectionChange={onSelectionChange}
      aria-label="Lamp monitoring values"
    >
      <TableHeader columns={columns}>
        {column => (
          <TableColumn key={column.key} align="end">
            {column.key}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={rows}>
        {item => (
          <TableRow key={item.key}>
            {columnKey => {
              const i = parseInt(columnKey as string);
              return (
                <TableCell key={i} width={i === 0 ? labelWidth : undefined}>
                  {i === 0
                    ? item.values[0]
                    : item.values[i] !== undefined
                      ? render(item.values[i] as T[keyof T], item.prop)
                      : undefined}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
