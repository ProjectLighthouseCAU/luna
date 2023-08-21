import { useEffect } from 'react';

export function useEventListener(
  value: EventTarget,
  event: string,
  listener: () => void,
  options: { fireImmediately?: boolean } = {}
) {
  useEffect(() => {
    if (options.fireImmediately ?? false) {
      listener();
    }
    value.addEventListener(event, listener);
    return () => value.removeEventListener(event, listener);
  }, [value, event, listener, options.fireImmediately]);
}
