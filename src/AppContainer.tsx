import React, { useContext, useEffect } from 'react';
import { ColorSchemeContext } from '@luna/contexts/ColorSchemeContext';
import { Outlet } from 'react-router-dom';

export function AppContainer() {
  const { colorScheme } = useContext(ColorSchemeContext);

  useEffect(() => {
    if (colorScheme.isDark) {
      document.documentElement.className = 'dark';
    } else {
      document.documentElement.className = 'light';
    }
  }, [colorScheme.isDark]);

  return (
    <div className="h-screen">
      <Outlet />
    </div>
  );
}
