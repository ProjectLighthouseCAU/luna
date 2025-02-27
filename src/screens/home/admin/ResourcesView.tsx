import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { ResourcesLayout } from '@luna/screens/home/admin/ResourcesLayout';
import { ResourcesToolbar } from '@luna/screens/home/admin/ResourcesToolbar';
import { ResourcesTreeView } from '@luna/screens/home/admin/ResourcesTreeView';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { DirectoryTree } from 'nighthouse/browser';
import { useCallback, useContext, useEffect, useState } from 'react';

export function ResourcesView() {
  const [layout, setLayout] = useLocalStorage<ResourcesLayout>(
    LocalStorageKey.AdminResourcesLayout,
    () => 'column'
  );

  const model = useContext(ModelContext);
  const [tree, setTree] = useState<DirectoryTree>();

  const refreshListing = useCallback(async () => {
    const result = await model.list([]);
    if (result.ok) {
      setTree(result.value);
    } else {
      console.log(result.error);
    }
  }, [model]);

  useEffect(() => {
    refreshListing();
  }, [refreshListing]);

  return (
    <HomeContent
      title="Resources"
      toolbar={
        <ResourcesToolbar
          layout={layout}
          onLayoutChange={setLayout}
          refreshListing={refreshListing}
        />
      }
    >
      {tree ? (
        <ResourcesTreeView
          tree={tree}
          layout={layout}
          refreshListing={refreshListing}
        />
      ) : undefined}
    </HomeContent>
  );
}
