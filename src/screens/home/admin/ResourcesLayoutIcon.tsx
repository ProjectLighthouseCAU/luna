import { ResourcesLayout } from '@luna/screens/home/admin/ResourcesLayout';
import {
  IconLayoutColumns,
  IconList,
  IconQuestionMark,
} from '@tabler/icons-react';

interface ResourcesLayoutIconProps {
  layout: ResourcesLayout;
}

export function ResourcesLayoutIcon({ layout }: ResourcesLayoutIconProps) {
  switch (layout) {
    case 'column':
      return <IconLayoutColumns />;
    case 'list':
      return <IconList />;
    default:
      return <IconQuestionMark />;
  }
}
