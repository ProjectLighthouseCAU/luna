import {
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalContent,
} from '@heroui/react';
import { useVisibleRoutes, VisibleRoute } from '@luna/hooks/useVisibleRoutes';
import { useMemo, useState } from 'react';

export interface QuickSwitcherModalProps {
  isOpen: boolean;
  setOpen: (show: boolean) => void;
}

function flatten(routes: VisibleRoute[]): VisibleRoute[] {
  return routes.flatMap(route => [route, ...flatten(route.children)]);
}

export function QuickSwitcherModal({
  isOpen,
  setOpen,
}: QuickSwitcherModalProps) {
  const [query, setQuery] = useState('');

  const visibleRoutes = useVisibleRoutes({});
  const flatRoutes = useMemo(() => flatten(visibleRoutes), [visibleRoutes]);

  const filteredRoutes = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return flatRoutes
      .filter(route => route.name.toLowerCase().includes(lowerQuery))
      .map(route => ({ ...route, key: JSON.stringify(route.path) }))
      .slice(0, 8);
  }, [flatRoutes, query]);

  const selectedKey =
    filteredRoutes.length > 0 ? filteredRoutes[0].key : undefined;

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        {onClose => (
          <div className="flex flex-col">
            <Input
              autoFocus
              placeholder="Where do you want to go?"
              value={query}
              onValueChange={setQuery}
            />
            {query ? (
              <Listbox
                className="p-2"
                items={filteredRoutes}
                aria-label="Results"
              >
                {route => (
                  <ListboxItem
                    key={route.key}
                    startContent={route.icon}
                    aria-label={route.name}
                  >
                    <div
                      className={route.key === selectedKey ? 'font-bold' : ''}
                    >
                      {route.name}
                    </div>
                  </ListboxItem>
                )}
              </Listbox>
            ) : null}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
