import { useEffect } from 'react';

export function useEventListener<T extends Array<any>>(
  value: EventTarget,
  event: string,
  listener: (...args: T) => void,
  options: { fireImmediately?: boolean } = {}
) {
  useEffect(() => {
    if (options.fireImmediately ?? false) {
      (listener as () => void)();
    }
    value.addEventListener(event, listener as any);
    return () => value.removeEventListener(event, listener as any);
  }, [value, event, listener, options.fireImmediately]);
}
