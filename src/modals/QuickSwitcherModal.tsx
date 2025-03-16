import { Input, Modal, ModalContent, Skeleton } from '@heroui/react';
import { useVisibleRoutes, VisibleRoute } from '@luna/hooks/useVisibleRoutes';
import { IconChevronRight } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

export interface QuickSwitcherModalProps {
  isOpen: boolean;
  setOpen: (show: boolean) => void;
}

function flatten(
  routes: VisibleRoute[],
  parentNames: string[] = []
): (VisibleRoute & { parentNames: string[] })[] {
  return routes.flatMap(route => [
    { ...route, parentNames },
    ...flatten(route.children, [...parentNames, route.name]),
  ]);
}

export function QuickSwitcherModal({
  isOpen,
  setOpen,
}: QuickSwitcherModalProps) {
  const [query, setQuery] = useState('');

  const visibleRoutes = useVisibleRoutes({});
  const flatRoutes = useMemo(() => flatten(visibleRoutes), [visibleRoutes]);

  const maxResults = 8;

  const filteredRoutes = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return flatRoutes
      .filter(route => route.name.toLowerCase().includes(lowerQuery))
      .map(route => ({ ...route, key: JSON.stringify(route.path) }))
      .slice(0, maxResults);
  }, [flatRoutes, query]);

  const selectedKey =
    filteredRoutes.length > 0 ? filteredRoutes[0].key : undefined;

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen} placement="top">
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
                {filteredRoutes.map(route =>
                  route ? (
                    <NavLink to={route.path} key={route.key} onClick={onClose}>
                      <div
                        className={`flex flex-row p-2 gap-2 items-center rounded-md ${route.key === selectedKey ? 'bg-primary' : ''}`}
                      >
                        {route.icon}
                        <div className="flex flex-row items-center">
                          {route.parentNames.map(name => (
                            <div key={name} className="flex flex-row">
                              {name}
                              <IconChevronRight />
                            </div>
                          ))}
                          <div
                            className={
                              route.key === selectedKey ? 'font-bold' : ''
                            }
                          >
                            {route.name}
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  ) : (
                    <Skeleton className="h-12" />
                  )
                )}
              </div>
            ) : null}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
