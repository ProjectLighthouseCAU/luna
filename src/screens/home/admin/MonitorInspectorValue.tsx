import { isBounded } from '@luna/utils/bounded';
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
  if (value === null) {
    return <>null</>;
  }
  if (value === undefined) {
    return <>undefined</>;
  }
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
      if (typeof value === 'object' && isBounded(value)) {
        return (
          <>
            <MonitorInspectorRawValue value={value.value} /> of{' '}
            <MonitorInspectorRawValue value={value.total} />
          </>
        );
      }
      return <>{JSON.stringify(value)}</>;
  }
}
