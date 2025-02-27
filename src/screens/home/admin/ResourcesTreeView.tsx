import { Button, Divider } from '@heroui/react';
import { ResourcesContentsView } from '@luna/screens/home/admin/ResourcesContentsView';
import { ResourcesLayout } from '@luna/screens/home/admin/ResourcesLayout';
import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
  IconFolder,
} from '@tabler/icons-react';
import { DirectoryTree } from 'nighthouse/browser';
import { useCallback, useMemo, useState } from 'react';

export interface ResourcesTreeViewProps {
  parentPath?: string[];
  tree: DirectoryTree | undefined | null;
  layout: ResourcesLayout;
}

export function ResourcesTreeView({
  parentPath: path = [],
  tree,
  layout,
}: ResourcesTreeViewProps) {
  // TODO: Use a set here and let the user expand multiple nodes (but only in
  // list view, in column view this doesn't make sense and shouldn't be allowed)
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
                    key={JSON.stringify([...path, name])}
                    name={name}
                    layout={layout}
                    subTree={subTree}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  />
                ))
              : undefined}
          </div>
          {expanded !== undefined ? (
            <>
              <div>
                <Divider orientation="vertical" />
              </div>
              {tree?.[expanded] !== null ? (
                <>
                  <ResourcesTreeView
                    key={JSON.stringify([...path, expanded])}
                    parentPath={[...path, expanded]}
                    tree={tree?.[expanded]!}
                    layout={layout}
                  />
                </>
              ) : (
                <ResourcesContentsView path={[...path, expanded]} />
              )}
            </>
          ) : undefined}
        </div>
      );
    case 'list':
      return (
        <div className="flex flex-col">
          {sortedEntries
            ? sortedEntries.map(([name, subTree]) => (
                <>
                  <ResourcesTreeButton
                    key={JSON.stringify([...path, name])}
                    name={name}
                    subTree={subTree}
                    layout={layout}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  />
                  {expanded === name ? (
                    <div className="ml-4">
                      {subTree === null ? (
                        <ResourcesContentsView path={[...path, expanded]} />
                      ) : (
                        <ResourcesTreeView
                          key={JSON.stringify([...path, expanded])}
                          parentPath={[...path, expanded]}
                          tree={subTree}
                          layout={layout}
                        />
                      )}
                    </div>
                  ) : undefined}
                </>
              ))
            : undefined}
        </div>
      );
  }
}

function ResourcesTreeButton({
  name,
  subTree,
  layout,
  expanded,
  setExpanded,
}: {
  name: string;
  subTree: DirectoryTree | null;
  layout: ResourcesLayout;
  expanded: string | undefined;
  setExpanded: (name?: string) => void;
}) {
  const isExpanded = useMemo(() => expanded === name, [expanded, name]);

  const color = useMemo(
    () => (isExpanded && layout === 'column' ? 'primary' : 'default'),
    [isExpanded, layout]
  );

  const onPress = useCallback(() => {
    setExpanded(isExpanded ? undefined : name);
  }, [name, isExpanded, setExpanded]);

  return (
    <Button onPress={onPress} color={color} variant="faded">
      <div className="flex flex-row justify-start gap-2 grow">
        {layout === 'list' ? (
          isExpanded ? (
            <IconChevronDown />
          ) : (
            <IconChevronRight />
          )
        ) : undefined}
        {subTree === null ? <IconFile /> : <IconFolder />}
        {name}
      </div>
    </Button>
  );
}
