import { ColorSchemeContext } from '@luna/contexts/env/ColorSchemeContext';
import { useContext } from 'react';

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const { colorScheme } = useContext(ColorSchemeContext);

  return (
    <img
      src={`${process.env.PUBLIC_URL}/logo${
        colorScheme.isDark ? '-dark' : ''
      }.svg`}
      alt="The Project Lighthouse logo"
      className={className}
    />
  );
}
