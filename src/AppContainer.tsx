import React, { useContext, useEffect } from 'react';
import { ColorSchemeContext } from '@luna/contexts/ColorSchemeContext';
import { Outlet } from 'react-router-dom';

export function AppContainer() {
  const { colorScheme } = useContext(ColorSchemeContext);

  useEffect(() => {
    const colorSchemeName = colorScheme.isDark ? 'dark' : 'light';
    document.documentElement.className = colorSchemeName;
    document.body.style.setProperty(
      '--luna-background-color',
      `--luna-background-${colorSchemeName}`
    );
  }, [colorScheme.isDark]);

  return (
    <div className="h-screen">
      <Outlet />
    </div>
  );
}
