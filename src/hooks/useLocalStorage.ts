import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { useEffect, useState } from 'react';

export function useLocalStorage<T>(
  key: LocalStorageKey,
  defaultValue: () => T
) {
  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue();
  });

  useEffect(() => {
    const raw = JSON.stringify(value);
    localStorage.setItem(key, raw);
  }, [key, value]);

  return [value, setValue];
}
