import { WindowDimensionsContext } from '@luna/contexts/WindowDimensions';
import { useContext } from 'react';

export enum Breakpoint {
  Xs,
  Sm,
  Md,
  Lg,
  Xl,
}

export function useBreakpoint(): Breakpoint {
  const { width } = useContext(WindowDimensionsContext);

  if (width <= 650) {
    return Breakpoint.Xs;
  } else if (width <= 960) {
    return Breakpoint.Sm;
  } else if (width <= 1280) {
    return Breakpoint.Md;
  } else if (width <= 1400) {
    return Breakpoint.Lg;
  } else {
    return Breakpoint.Xl;
  }
}
