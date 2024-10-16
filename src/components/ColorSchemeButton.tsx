import { ColorSchemeContext } from '@luna/contexts/env/ColorSchemeContext';
import { Button, Tooltip } from '@nextui-org/react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useCallback, useContext } from 'react';

export function ColorSchemeButton() {
  const { colorScheme, setColorScheme } = useContext(ColorSchemeContext);

  const toggleColorScheme = useCallback(
    () => setColorScheme(colorScheme => ({ isDark: !colorScheme.isDark })),
    [setColorScheme]
  );

  return (
    <Tooltip content="Toggle light/dark mode" placement="right">
      <Button isIconOnly onPress={toggleColorScheme} size="sm">
        {colorScheme.isDark ? <IconMoon /> : <IconSun />}
      </Button>
    </Tooltip>
  );
}
