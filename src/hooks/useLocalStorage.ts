import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { useEffect, useMemo, useState } from 'react';

export function useLocalStorage<T>(
  key: LocalStorageKey,
  defaultValue: () => T
) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    let value = defaultValue();
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof value === typeof parsed) {
        if (typeof value === 'object') {
          // Merge objects by only considering known keys
          for (const key in value) {
            if (key in parsed) {
              value[key] = parsed[key];
            }
          }
        } else {
          value = parsed;
        }
      } else {
        // We stored something else and will just keep the default
        // This might happen if the frontend updated this to a different type
      }
    }
    return value;
  });

  const json = useMemo(() => JSON.stringify(value), [value]);

  useEffect(() => {
    localStorage.setItem(key, json);
  }, [key, json]);

  return [value, setValue] as const;
}
