import { Input, Modal, ModalContent } from '@heroui/react';
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
      .slice(0, 8);
  }, [flatRoutes, query]);

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
              <div className="p-3">
                {filteredRoutes.map(route => (
                  <div
                    key={JSON.stringify(route.path)}
                    className="flex flex-row gap-1"
                  >
                    {route.icon} {route.name}
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
