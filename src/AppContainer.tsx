import React, { useContext, useEffect } from 'react';
import { ColorSchemeContext } from '@luna/contexts/ColorSchemeContext';
import { Outlet } from 'react-router-dom';

export function AppContainer() {
  const colorScheme = useContext(ColorSchemeContext);

  useEffect(() => {
    if (colorScheme.isDark) {
      document.documentElement.className = 'dark';
    } else {
      document.documentElement.className = 'light';
    }
  }, [colorScheme.isDark]);

  return (
    <div className="flex flex-col h-screen">
      {/* TODO: Add `REACT_APP_...` env var to check whether we are running in Electron */}
      <div className="shrink-0 electron-titlebar" />
      <div className="grow shrink">
        <Outlet />
      </div>
    </div>
  );
}
