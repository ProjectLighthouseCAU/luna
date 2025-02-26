import { Chip } from '@nextui-org/react';

export interface MonitorInspectorValueProps {
  value: any;
  unit?: string;
}

export function MonitorInspectorValue({
  value,
  unit,
}: MonitorInspectorValueProps) {
  return (
    <div className="flex flex-row gap-1">
      <MonitorInspectorRawValue value={value} />
      <div>{unit}</div>
    </div>
  );
}

function MonitorInspectorRawValue({ value }: { value: any }) {
  switch (typeof value) {
    case 'string':
      return <>{value}</>;
    case 'number':
      return <>{Number.isInteger(value) ? value : value.toFixed(4)}</>;
    case 'boolean':
      return (
        <Chip color={value ? 'success' : 'danger'} variant="flat">
          {value ? 'true' : 'false'}
        </Chip>
      );
    default:
      return <>{JSON.stringify(value)}</>;
  }
}
