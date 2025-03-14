import { useMemo } from 'react';

/**
 * A hook that performs a JSON roundtrip to make the value memoizable
 * based on its JSON string representation. This is e.g. useful for
 * arrays which may use a different instance if a literal is passed
 * on each render.
 */
export function useJsonMemo<T>(value: T): T {
  const json = useMemo(() => JSON.stringify(value), [value]);
  const roundtripValue = useMemo(() => JSON.parse(json), [json]);
  return roundtripValue;
}
