import { BooleanChip } from '@luna/components/BooleanChip';
import { isBounded } from '@luna/utils/bounded';

export interface ObjectInspectorValueProps {
  value: any;
  unit?: string;
}

export function ObjectInspectorValue({
  value,
  unit,
}: ObjectInspectorValueProps) {
  return (
    <div className="flex flex-row gap-1">
      <ObjectInspectorRawValue value={value} />
      <div>{unit}</div>
    </div>
  );
}

function ObjectInspectorRawValue({ value }: { value: any }) {
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
      return <BooleanChip value={value} />;
    default:
      if (typeof value === 'object' && isBounded(value)) {
        return (
          <>
            <ObjectInspectorRawValue value={value.value} /> of{' '}
            <ObjectInspectorRawValue value={value.total} />
          </>
        );
      }
      return <>{JSON.stringify(value)}</>;
  }
}
