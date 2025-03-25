import { DisplayInspectorTab } from '@luna/screens/home/displays/helpers/DisplayInspectorTab';
import { IconMovie, IconTools } from '@tabler/icons-react';

export interface DisplayInspectorTabIconProps {
  tab: DisplayInspectorTab;
}

export function DisplayInspectorTabIcon({ tab }: DisplayInspectorTabIconProps) {
  switch (tab) {
    case 'general':
      return <IconTools />;
    case 'animator':
      return <IconMovie />;
  }
}
