import { Button } from '@heroui/react';
import { UnderConstruction } from '@luna/components/UnderConstruction';
import { ResourcesLayout } from '@luna/screens/home/admin/ResourcesLayout';
import { IconFile, IconFolder } from '@tabler/icons-react';
import { DirectoryTree } from 'nighthouse/browser';
import { useCallback, useMemo, useState } from 'react';

export interface ResourcesTreeViewProps {
  tree: DirectoryTree | undefined | null;
  layout: ResourcesLayout;
}

export function ResourcesTreeView({ tree, layout }: ResourcesTreeViewProps) {
  const [expanded, setExpanded] = useState<string>();

  const sortedEntries = useMemo(
    () =>
      tree
        ? Object.entries(tree).sort(([name1, _1], [name2, _2]) =>
            name1.localeCompare(name2)
          )
        : undefined,
    [tree]
  );

  switch (layout) {
    case 'column':
      return (
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-2">
            {sortedEntries
              ? sortedEntries.map(([name, subTree]) => (
                  <ResourcesTreeButton
                    key={name}
                    name={name}
                    subTree={subTree}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  />
                ))
              : undefined}
          </div>
          {expanded !== undefined && tree?.[expanded] !== null ? (
            <ResourcesTreeView tree={tree?.[expanded]!} layout={layout} />
          ) : undefined}
        </div>
      );
    case 'list':
      return <UnderConstruction />; // TODO
  }
}

function ResourcesTreeButton({
  name,
  subTree,
  expanded,
  setExpanded,
}: {
  name: string;
  subTree: DirectoryTree | null;
  expanded: string | undefined;
  setExpanded: (name: string) => void;
}) {
  const color = useMemo(
    () => (expanded === name ? 'primary' : 'default'),
    [expanded, name]
  );

  const onPress = useCallback(() => {
    setExpanded(name);
  }, [name, setExpanded]);

  return (
    <Button onPress={onPress} color={color} variant="faded">
      <div className="flex flex-row justify-start gap-2 grow">
        {subTree === null ? <IconFile /> : <IconFolder />}
        {name}
      </div>
    </Button>
  );
}
