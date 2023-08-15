import React, {
  createContext,
  ReactNode,
  useLayoutEffect,
  useState,
} from 'react';

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

interface WindowDimensionsContextProps {
  children: ReactNode;
}

export function WindowDimensionsContextProvider({
  children,
}: WindowDimensionsContextProps) {
  const [dimensions, setDimensions] = useState(getWindowDimensions());

  useLayoutEffect(() => {
    const updateDimensions = () => {
      setDimensions(getWindowDimensions());
    };
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <WindowDimensionsContext.Provider value={dimensions}>
      {children}
    </WindowDimensionsContext.Provider>
  );
}
