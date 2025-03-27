import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';

export function useCompactStatus() {
  const breakpoint = useBreakpoint();

  const isCompact = breakpoint <= Breakpoint.Sm;

  return { isCompact };
}
