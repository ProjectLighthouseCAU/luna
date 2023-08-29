import { RouteLink } from '@luna/components/RouteLink';
import { AuthContext } from '@luna/contexts/AuthContext';
import { ModelContext } from '@luna/contexts/ModelContext';
import { SearchContext } from '@luna/contexts/SearchContext';
import { truncate } from '@luna/utils/string';
import {
  IconBuildingLighthouse,
  IconHeartRateMonitor,
  IconSettings,
  IconTower,
  IconUsers,
} from '@tabler/icons-react';
import { useContext } from 'react';
import { InView } from 'react-intersection-observer';

export interface SidebarRoutesProps {
  isCompact: boolean;
}

export function SidebarRoutes({ isCompact }: SidebarRoutesProps) {
  const auth = useContext(AuthContext);
  const model = useContext(ModelContext);
  const { query } = useContext(SearchContext);

  return (
    <>
      <RouteLink icon={<IconTower />} name="Admin" path="/admin">
        <RouteLink
          icon={<IconHeartRateMonitor />}
          name="Monitor"
          path="/admin/monitor"
        />
        <RouteLink icon={<IconUsers />} name="Users" path="/admin/users" />
        <RouteLink
          icon={<IconSettings />}
          name="Settings"
          path="/admin/settings"
        />
      </RouteLink>
      <RouteLink
        icon={<IconBuildingLighthouse />}
        name="Displays"
        path="/displays"
      >
        {auth.user ? (
          <RouteLink
            icon={<IconBuildingLighthouse />}
            name={`${auth.user.username} (me)`}
            path={`/displays/${auth.user.username}`}
          />
        ) : null}
        {!isCompact || query
          ? [...model.userModels.keys()]
              .filter(
                username =>
                  username !== auth.user?.username &&
                  username.toLowerCase().includes(query.toLowerCase())
              )
              .sort()
              .map(username => (
                <InView key={username}>
                  {({ inView, ref }) => (
                    <div ref={ref}>
                      <RouteLink
                        icon={<IconBuildingLighthouse />}
                        name={truncate(username, 14)}
                        path={`/displays/${username}`}
                        isSkeleton={!inView}
                      />
                    </div>
                  )}
                </InView>
              ))
          : null}
      </RouteLink>
    </>
  );
}
