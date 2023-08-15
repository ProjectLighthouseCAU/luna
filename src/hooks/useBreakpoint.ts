import { WindowDimensionsContext } from '@luna/contexts/WindowDimensionsContext';
import { useContext } from 'react';

export enum Breakpoint {
  Xs = 0,
  Sm = 650,
  Md = 960,
  Lg = 1280,
  Xl = 1400,
}

export function useBreakpoint(): Breakpoint {
  const { width } = useContext(WindowDimensionsContext);

  if (width < Breakpoint.Sm) {
    return Breakpoint.Xs;
  } else if (width < Breakpoint.Md) {
    return Breakpoint.Sm;
  } else if (width < Breakpoint.Lg) {
    return Breakpoint.Md;
  } else if (width < Breakpoint.Xl) {
    return Breakpoint.Lg;
  } else {
    return Breakpoint.Xl;
  }
}
