import { Chip } from '@heroui/react';
import {
  ColorScheme,
  ColorSchemeContext,
} from '@luna/contexts/env/ColorSchemeContext';
import { ReactNode, useContext } from 'react';

type LabelColor = 'default' | 'primary' | 'secondary' | 'danger';

export interface DisplayRouteLabelProps {
  isActive: boolean;
  color?: LabelColor;
  children: ReactNode;
}

function borderStyle(color: LabelColor, colorScheme: ColorScheme): string {
  switch (color) {
    case 'default':
      return colorScheme.isDark ? 'border-white' : 'border-black';
    case 'primary':
      return 'border-primary';
    case 'secondary':
      return 'border-secondary';
    case 'danger':
      return 'border-danger';
  }
}

function textStyle(color: LabelColor, colorScheme: ColorScheme): string {
  switch (color) {
    case 'default':
      return colorScheme.isDark ? 'text-white' : 'text-black';
    case 'primary':
      return 'text-primary';
    case 'secondary':
      return 'text-secondary';
    case 'danger':
      return 'text-danger';
  }
}
export function DisplayRouteLabel({
  isActive,
  color = 'default',
  children,
}: DisplayRouteLabelProps) {
  const { colorScheme } = useContext(ColorSchemeContext);

  return (
    <Chip
      classNames={{
        base: isActive ? 'border-white' : borderStyle(color, colorScheme),
        content: `uppercase font-bold ${
          isActive ? 'text-white' : textStyle(color, colorScheme)
        }`,
      }}
      variant="bordered"
      size="sm"
    >
      {children}
    </Chip>
  );
}
