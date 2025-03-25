import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { useEffect, useMemo, useState } from 'react';

/** Recursively merges two values, discarding anything not matching `base`'s schema. */
function merge(base: any, delta: any): any {
  if (typeof base === typeof delta) {
    // TODO: This doesn't deal with schema changes in arrays, where stale values
    // from the delta may still be kept. Is this a case we need to consider?
    if (typeof base === 'object' && !Array.isArray(base)) {
      const merged = { ...base };
      for (const key in base) {
        if (key in delta) {
          merged[key] = merge(base[key], delta[key]);
        }
      }
      return merged;
    } else {
      return delta;
    }
  }
  return base;
}

export function useLocalStorage<T>(
  key: LocalStorageKey,
  defaultValue: () => T
) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    let value = defaultValue();
    if (raw) {
      const parsed = JSON.parse(raw);
      // TODO: This currently does not work properly when the default value is
      // `null`, since we have no idea what the schema would look like in that case.
      // We could just trust the parsed value, but that may result in inconsistencies
      // should we ever wish to change that.
      value = merge(value, parsed);
    }
    return value;
  });

  const json = useMemo(() => JSON.stringify(value), [value]);

  useEffect(() => {
    localStorage.setItem(key, json);
  }, [key, json]);

  return [value, setValue] as const;
}
