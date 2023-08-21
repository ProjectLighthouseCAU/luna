import { useLayoutEffect } from 'react';

export function useLayoutEventListener(
  value: EventTarget,
  event: string,
  listener: () => void,
  options: { fireImmediately?: boolean } = {}
) {
  useLayoutEffect(() => {
    if (options.fireImmediately ?? false) {
      listener();
    }
    value.addEventListener(event, listener);
    return () => value.removeEventListener(event, listener);
  }, [value, event, listener, options.fireImmediately]);
}
