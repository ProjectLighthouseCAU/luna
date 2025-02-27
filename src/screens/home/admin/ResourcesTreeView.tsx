import {
  Button,
  Divider,
  DropdownItem,
  DropdownMenu,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { ContextMenu } from '@luna/components/ContextMenu';
import { SearchBar } from '@luna/components/SearchBar';
import { SimpleEditForm } from '@luna/components/SimpleEditForm';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
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
import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export interface ResourcesTreeViewProps {
  parentPath?: string[];
  tree: DirectoryTree | undefined | null;
  layout: ResourcesLayout;
  refreshListing: () => Promise<void>;
}

export function ResourcesTreeView({
  parentPath: path = [],
  tree,
  layout,
  refreshListing,
}: ResourcesTreeViewProps) {
  const model = useContext(ModelContext);

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

  const createFolder = useCallback(
    async (name: string) => {
      await model.mkdir([...path, name]);
      await refreshListing();
    },
    [model, path, refreshListing]
  );

  const createResource = useCallback(
    async (name: string) => {
      await model.create([...path, name]);
      await refreshListing();
    },
    [model, path, refreshListing]
  );

  const additionalElements = useMemo(
    () => (
      <>
        <ResourcesTreeCreateButton title="New Folder" onCreate={createFolder} />
        <ResourcesTreeCreateButton
          title="New Resource"
          onCreate={createResource}
        />
      </>
    ),
    [createFolder, createResource]
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
                    path={[...path, name]}
                    layout={layout}
                    subTree={subTree}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    refreshListing={refreshListing}
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
                    refreshListing={refreshListing}
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
                        path={[...path, name]}
                        subTree={subTree}
                        layout={layout}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        refreshListing={refreshListing}
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
                          refreshListing={refreshListing}
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
  subTree,
  path,
  layout,
  expanded,
  setExpanded,
  refreshListing,
}: {
  subTree: DirectoryTree | null;
  path: string[];
  layout: ResourcesLayout;
  expanded: string | undefined;
  setExpanded: (name?: string) => void;
  refreshListing: () => Promise<void>;
}) {
  const model = useContext(ModelContext);
  const [isRenaming, setRenaming] = useState(false);

  const name = useMemo(() => path[path.length - 1], [path]);
  const isExpanded = useMemo(() => expanded === name, [expanded, name]);

  const isResource = useMemo(() => subTree === null, [subTree]);

  const color = useMemo(
    () => (isExpanded && layout === 'column' ? 'primary' : 'default'),
    [isExpanded, layout]
  );

  const toggleExpanded = useCallback(() => {
    setExpanded(isExpanded ? undefined : name);
  }, [name, isExpanded, setExpanded]);

  const openRename = useCallback(() => setRenaming(true), []);

  const downloadPath = useCallback(async () => {
    const result = await model.get(path);
    if (result.ok) {
      const json = JSON.stringify(result.value, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.download = `${name}.json`;
      a.href = url;
      a.click();
    } else {
      console.log(result.error);
    }
  }, [model, name, path]);

  const deletePath = useCallback(async () => {
    await model.delete(path);
    await refreshListing();
    setExpanded(undefined);
  }, [model, path, refreshListing, setExpanded]);

  const renamePath = useCallback(
    async (newName: string) => {
      if (isResource) {
        const newPath = [...path.slice(0, -1), newName];
        console.log('Moving to', newPath);
        await model.move(path, newPath);
        await refreshListing();
        setExpanded(newName);
      }
      setRenaming(false);
    },
    [isResource, path, model, refreshListing, setExpanded]
  );

  return (
    <ContextMenu
      menu={
        <DropdownMenu>
          {isResource ? (
            <>
              <DropdownItem key="rename" onPress={openRename}>
                Rename
              </DropdownItem>
              <DropdownItem key="download" onPress={downloadPath}>
                Download
              </DropdownItem>
            </>
          ) : null}
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onPress={deletePath}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      }
    >
      <Button
        onPress={toggleExpanded}
        color={color}
        variant="faded"
        className="w-full"
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
      <Modal isOpen={isRenaming} onOpenChange={setRenaming}>
        <ModalContent>
          <ModalHeader>Rename Resource...</ModalHeader>
          <ModalBody>
            <SimpleEditForm initialValue={name} onSubmit={renamePath} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </ContextMenu>
  );
}

function ResourcesTreeCreateButton({
  icon = <IconPlus />,
  title,
  onCreate,
}: {
  icon?: ReactNode;
  title: string;
  onCreate: (name: string) => void;
}) {
  const [isOpen, setOpen] = useState(false);

  const onSubmit = useCallback(
    (name: string) => {
      setOpen(false);
      onCreate(name);
    },
    [onCreate]
  );

  return (
    <Popover
      placement="bottom"
      showArrow
      isOpen={isOpen}
      onOpenChange={setOpen}
    >
      <PopoverTrigger>
        <Button variant="ghost">
          <div className="flex flex-row justify-start items-center gap-2 grow">
            {icon}
            {title}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <SimpleEditForm onSubmit={onSubmit} />
      </PopoverContent>
    </Popover>
  );
}
