import { MutableRefObject, useRef } from 'react';

export function useInitRef<T>(initializer: () => T): MutableRefObject<T> {
  const ref = useRef<T | null>(null);
  if (ref.current === null) {
    ref.current = initializer();
  }
  return ref as MutableRefObject<T>;
}
