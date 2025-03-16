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
    if (!query) return [];
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
              variant="faded"
              placeholder="Where do you want to go?"
              value={query}
              onValueChange={setQuery}
              classNames={{
                // Remove focus ring: https://dev.to/janjitsu/remove-ring-border-from-nextui-input-component-11h1
                inputWrapper:
                  'group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0',
              }}
            />
            {filteredRoutes.length > 0 ? (
              <div className="flex flex-col gap-2 p-2" aria-label="Results">
                {filteredRoutes.map(route => (
                  <div className="flex flex-row gap-2">
                    {route.icon}
                    <div
                      className={route.key === selectedKey ? 'font-bold' : ''}
                    >
                      {route.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
