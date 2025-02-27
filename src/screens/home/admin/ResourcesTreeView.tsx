import { UnderConstruction } from '@luna/components/UnderConstruction';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { ResourcesLayout } from '@luna/screens/home/admin/ResourcesLayout';
import { useContext } from 'react';

export interface ResourcesTreeViewProps {
  layout: ResourcesLayout;
  path: string[];
}

export function ResourcesTreeView({ path, layout }: ResourcesTreeViewProps) {
  const model = useContext(ModelContext);

  switch (layout) {
    case 'column':
      return <></>;
    case 'list':
      return <UnderConstruction />; // TODO
  }
}
