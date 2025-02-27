import { UnderConstruction } from '@luna/components/UnderConstruction';
import { ResourcesLayout } from '@luna/screens/home/admin/ResourcesLayout';
import { DirectoryTree } from 'nighthouse/browser';

export interface ResourcesTreeViewProps {
  layout: ResourcesLayout;
  tree: DirectoryTree;
}

export function ResourcesTreeView({ layout }: ResourcesTreeViewProps) {
  switch (layout) {
    case 'column':
      return <></>;
    case 'list':
      return <UnderConstruction />; // TODO
  }
}
