import { debounce } from '@luna/utils/schedule';
import { useMemo } from 'react';

export function useDebounce<T extends Array<any>>(
  action: (...args: T) => void,
  intervalMs: number
): (...args: T) => void {
  return useMemo(() => debounce(action, intervalMs), [action, intervalMs]);
}
