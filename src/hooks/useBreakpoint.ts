import { WindowDimensionsContext } from '@luna/contexts/env/WindowDimensionsContext';
import { useContext } from 'react';

export enum Breakpoint {
  // Source: https://tailwindcss.com/docs/responsive-design
  Xs = 0,
  Sm = 640,
  Md = 758,
  Lg = 1024,
  Xl = 1280,
  TwoXl = 1536,
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
