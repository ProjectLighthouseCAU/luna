import { Divider } from '@heroui/react';
import { RouteLink } from '@luna/components/RouteLink';
import { DisplaySearchContext } from '@luna/contexts/displays/DisplaySearchContext';
import {
  useVisibleRoutes,
  VisibleRoute,
  VisibleRouteItem,
} from '@luna/hooks/useVisibleRoutes';
import { truncate } from '@luna/utils/string';
import { useContext, useMemo } from 'react';
import { InView } from 'react-intersection-observer';

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
        if (filteredChildren.length > 0) {
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
  const { query: displaySearchQuery } = useContext(DisplaySearchContext);

  const visibleRouteItems = useVisibleRoutes({
    showUserDisplays: !isCompact,
    displaySearchQuery,
  });

  const filteredVisibleRouteItems = useMemo(
    () =>
      searchQuery.length > 0
        ? filterRoutes(visibleRouteItems, searchQuery.toLowerCase())
        : visibleRouteItems,
    [searchQuery, visibleRouteItems]
  );

  return <SidebarVisibleRouteItems routeItems={filteredVisibleRouteItems} />;
}

function SidebarVisibleRouteItems({
  routeItems,
}: {
  routeItems: VisibleRouteItem[];
}) {
  return (
    <>
      {routeItems.map(item => (
        <SidebarVisibleRouteItem
          key={`${item.type}$${item.name}`}
          routeItem={item}
        />
      ))}
    </>
  );
}

function SidebarVisibleRouteItem({
  routeItem,
}: {
  routeItem: VisibleRouteItem;
}) {
  switch (routeItem.type) {
    case 'route':
      return <SidebarVisibleRoute route={routeItem} />;
    case 'divider':
      return <Divider />;
  }
}

function SidebarVisibleRoute({ route }: { route: VisibleRoute }) {
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
        <SidebarVisibleRouteItems routeItems={route.children} />
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
