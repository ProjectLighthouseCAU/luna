import { RouteLink } from '@luna/components/RouteLink';
import { useVisibleRoutes, VisibleRoute } from '@luna/hooks/useVisibleRoutes';
import { truncate } from '@luna/utils/string';
import { InView } from 'react-intersection-observer';

export interface SidebarRoutesProps {
  isCompact: boolean;
  searchQuery: string;
}

export function SidebarRoutes({ isCompact, searchQuery }: SidebarRoutesProps) {
  const visibleRoutes = useVisibleRoutes({
    showUserDisplays: !isCompact,
    searchQuery,
  });

  return <SidebarVisibleRoutes routes={visibleRoutes} />;
}

function SidebarVisibleRoutes({ routes }: { routes: VisibleRoute[] }) {
  return (
    <>
      {routes.map(route => (
        <SidebarVisibleRoute key={route.name} route={route} />
      ))}
    </>
  );
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
        <SidebarVisibleRoutes routes={route.children} />
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
