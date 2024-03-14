import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { useEffect, useMemo, useState } from 'react';

export function useLocalStorage<T>(
  key: LocalStorageKey,
  defaultValue: () => T
) {
  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue();
  });

  const json = useMemo(() => JSON.stringify(value), [value]);

  useEffect(() => {
    localStorage.setItem(key, json);
  }, [key, json]);

  return [value, setValue];
}
