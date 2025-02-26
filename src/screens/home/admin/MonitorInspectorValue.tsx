import { Chip } from '@nextui-org/react';

export interface MonitorInspectorValueProps {
  value: any;
}

export function MonitorInspectorValue({ value }: MonitorInspectorValueProps) {
  switch (typeof value) {
    case 'string':
      return <>{value}</>;
    case 'number':
      return <>{value}</>;
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
