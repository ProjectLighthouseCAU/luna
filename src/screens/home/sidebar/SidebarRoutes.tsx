import { Divider } from '@heroui/react';
import { RouteLink } from '@luna/components/RouteLink';
import {
  useVisibleRoutes,
  VisibleRoute,
  VisibleRouteItem,
} from '@luna/hooks/useVisibleRoutes';
import { truncate } from '@luna/utils/string';
import { InView } from 'react-intersection-observer';

export interface SidebarRoutesProps {
  isCompact: boolean;
  searchQuery: string;
}

export function SidebarRoutes({ isCompact, searchQuery }: SidebarRoutesProps) {
  const visibleRouteItems = useVisibleRoutes({
    showUserDisplays: !isCompact,
    searchQuery,
  });

  return <SidebarVisibleRouteItems routeItems={visibleRouteItems} />;
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
