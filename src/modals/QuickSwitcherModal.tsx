import { Input, Modal, ModalContent, Skeleton } from '@heroui/react';
import { useVisibleRoutes, VisibleRoute } from '@luna/hooks/useVisibleRoutes';
import { IconChevronRight } from '@tabler/icons-react';
import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export interface QuickSwitcherModalProps {
  isOpen: boolean;
  setOpen: (show: boolean) => void;
}

function flatten(
  routes: VisibleRoute[],
  parentNames: string[] = []
): (VisibleRoute & { parentNames: string[] })[] {
  return (
    routes
      .flatMap(route => [
        { ...route, parentNames },
        ...flatten(route.children ?? [], [...parentNames, route.name]),
      ])
      // Prioritize longer paths
      .sort((a, b) => b.path.length - a.path.length)
  );
}

export function QuickSwitcherModal({
  isOpen,
  setOpen,
}: QuickSwitcherModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRoute =
    filteredRoutes.length > 0 ? filteredRoutes[selectedIndex] : undefined;

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      switch (e.code) {
        case 'ArrowUp':
          setSelectedIndex(
            i => (i - 1 + filteredRoutes.length) % filteredRoutes.length
          );
          e.preventDefault();
          break;
        case 'ArrowDown':
          setSelectedIndex(i => (i + 1) % filteredRoutes.length);
          e.preventDefault();
          break;
        case 'Escape':
          setOpen(false);
          e.preventDefault();
          break;
      }
    },
    [filteredRoutes.length, setOpen]
  );

  const onUpdateQuery = useCallback((newQuery: string) => {
    setSelectedIndex(0);
    setQuery(newQuery);
  }, []);

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen} placement="top">
      <ModalContent>
        {onClose => (
          <form
            className="flex flex-col"
            onSubmit={e => {
              if (selectedRoute) {
                navigate(selectedRoute.path);
                onClose();
              }
              e.preventDefault();
            }}
          >
            <Input
              autoFocus
              variant="faded"
              placeholder="Where do you want to go?"
              value={query}
              onValueChange={onUpdateQuery}
              onKeyDown={onKeyDown}
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
                        className={`flex flex-row justify-between p-2 gap-2 items-center rounded-md ${route.key === selectedRoute?.key ? 'bg-primary text-white' : ''}`}
                      >
                        <div className={`flex flex-row gap-2 items-center`}>
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
                                route.key === selectedRoute?.key
                                  ? 'font-bold'
                                  : ''
                              }
                            >
                              {route.name}
                            </div>
                          </div>
                        </div>
                        {route.label?.({
                          isActive: route.key === selectedRoute?.key,
                        })}
                      </div>
                    </NavLink>
                  ) : (
                    <Skeleton className="h-12" />
                  )
                )}
              </div>
            ) : null}
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
