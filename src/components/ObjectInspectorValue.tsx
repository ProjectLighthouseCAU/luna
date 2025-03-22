import { BooleanCheck } from '@luna/components/BooleanCheck';
import { isBounded } from '@luna/utils/bounded';
import * as vec2 from '@luna/utils/vec2';

export interface ObjectInspectorValueProps {
  value: any;
  unit?: string;
  precision?: number;
}

export function ObjectInspectorValue({
  value,
  unit,
  precision,
}: ObjectInspectorValueProps) {
  return (
    <div className="flex flex-row gap-1">
      <ObjectInspectorRawValue value={value} precision={precision} />
      <div>{unit}</div>
    </div>
  );
}

function ObjectInspectorRawValue({
  value,
  precision = 4,
}: {
  value: any;
  precision?: number;
}) {
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
      return <>{Number.isInteger(value) ? value : value.toFixed(precision)}</>;
    case 'boolean':
      return <BooleanCheck value={value} />;
    case 'object':
      if (vec2.isInstance(value)) {
        return (
          <div className="flex flex-col items-start">
            <span>
              x: <ObjectInspectorRawValue value={value.x} precision={2} />
            </span>
            <span>
              y: <ObjectInspectorRawValue value={value.y} precision={2} />
            </span>
          </div>
        );
      } else if (isBounded(value)) {
        return (
          <>
            <ObjectInspectorRawValue value={value.value} /> of{' '}
            <ObjectInspectorRawValue value={value.total} />
          </>
        );
      } else if (value instanceof Uint8Array) {
        return (
          <>{[...value].map(v => v.toString(16).toUpperCase()).join(' ')}</>
        );
      }
      return <>{JSON.stringify(value)}</>;
    default:
      return <>?</>;
  }
}
