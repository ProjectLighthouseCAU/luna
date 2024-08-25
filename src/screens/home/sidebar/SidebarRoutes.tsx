import { User } from '@luna/api/auth/User';
import { RouteLink } from '@luna/components/RouteLink';
import { truncate } from '@luna/utils/string';
import {
  IconBuildingLighthouse,
  IconHeartRateMonitor,
  IconList,
  IconSettings,
  IconTower,
  IconUsers,
} from '@tabler/icons-react';
import { memo } from 'react';
import { InView } from 'react-intersection-observer';

export interface SidebarRoutesProps {
  isCompact: boolean;
  searchQuery: string;
  user?: User;
  allUsernames: string[];
}

export const SidebarRoutes = memo(
  ({ isCompact, searchQuery, user, allUsernames }: SidebarRoutesProps) => {
    return (
      <>
        <RouteLink icon={<IconTower />} name="Admin" path="/admin">
          <RouteLink
            icon={<IconList />}
            name="Resources"
            path="/admin/resources"
          />
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
          {user ? (
            <RouteLink
              icon={<IconBuildingLighthouse />}
              name={`${user.username} (me)`}
              path={`/displays/${user.username}`}
            />
          ) : null}
          {!isCompact || searchQuery
            ? allUsernames
                .filter(
                  username =>
                    username !== user?.username &&
                    username.toLowerCase().includes(searchQuery.toLowerCase())
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
  },
  // Believe it or not, this actually works pretty well and makes things more performant
  (prevProps, newProps) =>
    JSON.stringify(prevProps) === JSON.stringify(newProps)
);
