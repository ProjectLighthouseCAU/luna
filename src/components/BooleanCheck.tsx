import { ColorSchemeContext } from '@luna/contexts/env/ColorSchemeContext';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useContext } from 'react';

export interface BooleanCheckProps {
  value: boolean;
}

export function BooleanCheck({ value }: BooleanCheckProps) {
  const { colorScheme } = useContext(ColorSchemeContext);

  return value ? (
    <IconCheck
      color={colorScheme.isDark ? 'rgb(60, 255, 0)' : 'rgb(0, 180, 0)'}
    />
  ) : (
    <IconX color="red" />
  );
}
