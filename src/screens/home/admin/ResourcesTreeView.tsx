import { Button, Divider, Tooltip } from '@heroui/react';
import { SearchBar } from '@luna/components/SearchBar';
import { ResourcesContentsView } from '@luna/screens/home/admin/ResourcesContentsView';
import { ResourcesLayout } from '@luna/screens/home/admin/ResourcesLayout';
import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
  IconFolder,
  IconPlus,
} from '@tabler/icons-react';
import { DirectoryTree } from 'nighthouse/browser';
import { ReactNode, useCallback, useMemo, useState } from 'react';

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
  const [filter, setFilter] = useState<string>('');

  const name = useMemo(
    () => (path.length === 0 ? 'root' : path[path.length - 1]),
    [path]
  );

  const sortedEntries = useMemo(
    () =>
      tree
        ? Object.entries(tree)
            .filter(([name, _]) =>
              name.toLowerCase().includes(filter.toLowerCase())
            )
            .sort(([name1, _1], [name2, _2]) => name1.localeCompare(name2))
        : undefined,
    [filter, tree]
  );

  const toolbar = useMemo(
    () => (
      <>
        <SearchBar
          fullWidth
          placeholder={`Search ${name}`}
          className={layout === 'column' ? 'max-w-40' : 'max-w-full'}
          setQuery={setFilter}
        />
      </>
    ),
    [layout, name]
  );

  const additionalButton = useCallback(
    (icon: ReactNode, title: string) => (
      <Button variant="ghost">
        <div className="flex flex-row justify-start items-center gap-2 grow">
          {icon}
          {title}
        </div>
      </Button>
    ),
    []
  );

  const additionalElements = useMemo(
    () => (
      <>
        {additionalButton(<IconPlus />, 'New Folder')}
        {additionalButton(<IconPlus />, 'New Resource')}
      </>
    ),
    [additionalButton]
  );

  switch (layout) {
    case 'column':
      return (
        <div className="flex flex-row gap-2 h-full">
          <div className="flex flex-col gap-2 h-full">
            {toolbar}
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
            {additionalElements}
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
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-1">
            {toolbar}
            {additionalElements}
          </div>
          {sortedEntries
            ? sortedEntries.map(([name, subTree]) => (
                <>
                  <div className="flex flex-row gap-1">
                    <div className="grow">
                      <ResourcesTreeButton
                        key={JSON.stringify([...path, name])}
                        name={name}
                        subTree={subTree}
                        layout={layout}
                        expanded={expanded}
                        setExpanded={setExpanded}
                      />
                    </div>
                  </div>
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
    <Button
      onPress={onPress}
      color={color}
      variant="faded"
      className={layout === 'list' ? 'w-full' : ''}
    >
      <div className="flex flex-row justify-start items-center gap-2 grow">
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
