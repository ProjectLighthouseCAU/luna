import { useLayoutEventListener } from '@luna/hooks/useLayoutEventListener';
import React, { createContext, ReactNode, useCallback, useState } from 'react';

export interface WindowDimensions {
  readonly width: number;
  readonly height: number;
}

function getWindowDimensions(): WindowDimensions {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export const WindowDimensionsContext = createContext<WindowDimensions>(
  getWindowDimensions()
);

interface WindowDimensionsContextProviderProps {
  children: ReactNode;
}

export function WindowDimensionsContextProvider({
  children,
}: WindowDimensionsContextProviderProps) {
  const [dimensions, setDimensions] = useState(getWindowDimensions);

  const updateDimensions = useCallback(() => {
    setDimensions(getWindowDimensions());
  }, []);

  useLayoutEventListener(window, 'resize', updateDimensions);

  return (
    <WindowDimensionsContext.Provider value={dimensions}>
      {children}
    </WindowDimensionsContext.Provider>
  );
}
