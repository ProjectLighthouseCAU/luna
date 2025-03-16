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
        <InView key={route.name}>
          {({ inView, ref }) => (
            <div ref={ref}>
              <RouteLink
                icon={route.icon}
                name={truncate(route.name, 18)}
                path={route.path}
                isSkeleton={!inView}
              >
                {route.children.length > 0 ? (
                  <SidebarVisibleRoutes routes={route.children} />
                ) : null}
              </RouteLink>
            </div>
          )}
        </InView>
      ))}
    </>
  );
}
