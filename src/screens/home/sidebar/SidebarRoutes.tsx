import { Button, Divider } from '@heroui/react';
import { RouteLink } from '@luna/components/RouteLink';
import { DisplaySearchContext } from '@luna/contexts/displays/DisplaySearchContext';
import {
  useVisibleRoutes,
  VisibleRoute,
  VisibleRouteItem,
} from '@luna/hooks/useVisibleRoutes';
import { truncate } from '@luna/utils/string';
import { IconX } from '@tabler/icons-react';
import { useCallback, useContext, useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';

export interface SidebarRoutesProps {
  isCompact: boolean;
  searchQuery: string;
}

function filterRoutes(
  routeItems: VisibleRouteItem[],
  lowerQuery: string
): VisibleRouteItem[] {
  return routeItems.flatMap<VisibleRouteItem>(item => {
    if (item.type === 'route') {
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterRoutes(item.children, lowerQuery);
        if (
          item.name.toLowerCase().includes(lowerQuery) ||
          filteredChildren.length > 0
        ) {
          return [
            {
              ...item,
              children: filteredChildren,
            },
          ];
        }
      } else if (item.name.toLowerCase().includes(lowerQuery)) {
        return [item];
      }
    }
    return [];
  });
}

export function SidebarRoutes({ isCompact, searchQuery }: SidebarRoutesProps) {
  const displaySearch = useContext(DisplaySearchContext);
  const location = useLocation();

  const visibleRouteItems = useVisibleRoutes({
    showUserDisplays: !isCompact || searchQuery.length > 0,
    activePath: location.pathname,
    displaySearchQuery: displaySearch.query,
  });

  const filteredVisibleRouteItems = useMemo(
    () =>
      searchQuery.length > 0
        ? filterRoutes(visibleRouteItems, searchQuery.toLowerCase())
        : visibleRouteItems,
    [searchQuery, visibleRouteItems]
  );

  const clearDisplaySearch = useCallback(
    () => displaySearch.setQuery(''),
    [displaySearch]
  );

  return (
    <SidebarVisibleRouteItems
      routeItems={filteredVisibleRouteItems}
      clearDisplaySearch={clearDisplaySearch}
    />
  );
}

function SidebarVisibleRouteItems({
  routeItems,
  clearDisplaySearch,
}: {
  routeItems: VisibleRouteItem[];
  clearDisplaySearch: () => void;
}) {
  return (
    <>
      {routeItems.map(item => (
        <SidebarVisibleRouteItem
          key={`${item.type}$${item.name}`}
          routeItem={item}
          clearDisplaySearch={clearDisplaySearch}
        />
      ))}
    </>
  );
}

function SidebarVisibleRouteItem({
  routeItem,
  clearDisplaySearch,
}: {
  routeItem: VisibleRouteItem;
  clearDisplaySearch: () => void;
}) {
  switch (routeItem.type) {
    case 'route':
      return (
        <SidebarVisibleRoute
          route={routeItem}
          clearDisplaySearch={clearDisplaySearch}
        />
      );
    case 'divider':
      return <Divider />;
    case 'clearDisplaySearch':
      return (
        <Button
          className="w-full mt-2 mb-2"
          size="sm"
          variant="ghost"
          startContent={<IconX size={15} />}
          onPress={clearDisplaySearch}
        >
          Clear Display Filter
        </Button>
      );
  }
}

function SidebarVisibleRoute({
  route,
  clearDisplaySearch,
}: {
  route: VisibleRoute;
  clearDisplaySearch: () => void;
}) {
  const routeLink = (inView: boolean) => (
    <RouteLink
      icon={route.icon}
      name={truncate(route.name, 18)}
      label={route.label}
      contextMenu={route.contextMenu}
      path={route.path}
      isSkeleton={!inView}
    >
      {route.children && route.children.length > 0 ? (
        <SidebarVisibleRouteItems
          routeItems={route.children}
          clearDisplaySearch={clearDisplaySearch}
        />
      ) : null}
    </RouteLink>
  );

  return route.isLazyLoaded ? (
    <InView>
      {({ inView, ref }) => <div ref={ref}>{routeLink(inView)}</div>}
    </InView>
  ) : (
    routeLink(true)
  );
}
