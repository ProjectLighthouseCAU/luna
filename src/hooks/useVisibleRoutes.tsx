import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useJsonMemo } from '@luna/hooks/useJsonMemo';
import {
  IconBuildingLighthouse,
  IconCategory,
  IconFolder,
  IconHeartRateMonitor,
  IconKey,
  IconSettings,
  IconTower,
  IconUsers,
} from '@tabler/icons-react';
import { ReactNode, useContext, useMemo } from 'react';
import { Set } from 'immutable';
import { DisplayRouteLabel } from '@luna/components/DisplayRouteLabel';
import { useLiveUser } from '@luna/hooks/useLiveUser';

interface LabelParams {
  isActive: boolean;
}

export interface VisibleRoute {
  name: string;
  path: string;
  icon: ReactNode;
  label?: (params: LabelParams) => ReactNode;
  isLazyLoaded?: boolean;
  children?: VisibleRoute[];
}

export function useVisibleRoutes({
  showUserDisplays = true,
  searchQuery = '',
}: {
  showUserDisplays?: boolean;
  searchQuery?: string;
}) {
  const { users } = useContext(ModelContext);
  const auth = useContext(AuthContext);

  const user = useMemo(() => auth.user, [auth.user]);
  const isAdmin = useMemo(
    () => user?.roles.find(role => role.name === 'admin') !== undefined,
    [user?.roles]
  );

  const adminRoutes = useMemo(
    () => [
      {
        name: 'Admin',
        path: '/admin',
        icon: <IconTower />,
        children: [
          {
            name: 'Resources',
            path: '/admin/resources',
            icon: <IconFolder />,
          },
          {
            name: 'Monitoring',
            path: '/admin/monitoring',
            icon: <IconHeartRateMonitor />,
          },
          {
            name: 'Users',
            path: '/admin/users',
            icon: <IconUsers />,
          },
          {
            name: 'Roles',
            path: '/admin/roles',
            icon: <IconCategory />,
          },
          {
            name: 'Registration Keys',
            path: '/admin/registration-keys',
            icon: <IconKey />,
          },
          {
            name: 'Settings',
            path: '/admin/settings',
            icon: <IconSettings />,
          },
        ],
      },
    ],
    []
  );

  const allUsernames = useJsonMemo([...users.all]);

  const { liveUsername } = useLiveUser();

  const pinnedUsers = useMemo(
    () => [
      ...(user?.username
        ? [
            {
              username: user.username,
              label: ({ isActive }: LabelParams) => (
                <DisplayRouteLabel isActive={isActive} color="secondary">
                  me
                </DisplayRouteLabel>
              ),
            },
          ]
        : []),
      ...(liveUsername
        ? [
            {
              username: liveUsername,
              label: ({ isActive }: LabelParams) => (
                <DisplayRouteLabel isActive={isActive} color="danger">
                  live
                </DisplayRouteLabel>
              ),
            },
          ]
        : []),
    ],
    [liveUsername, user?.username]
  );

  const pinnedUsernames = useMemo(
    () => Set(pinnedUsers.map(u => u.username)),
    [pinnedUsers]
  );

  const userRoutes = useMemo(
    () => [
      {
        name: 'Displays',
        path: '/displays',
        icon: <IconBuildingLighthouse />,
        children: [
          ...pinnedUsers.map(pinned => ({
            name: pinned.username,
            icon: <IconBuildingLighthouse />,
            label: pinned.label,
            path: `/displays/${pinned.username}`,
          })),
          ...(showUserDisplays || searchQuery
            ? allUsernames
                .filter(
                  username =>
                    !pinnedUsernames.contains(username) &&
                    username.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .sort()
                .map<VisibleRoute>(username => ({
                  name: username,
                  path: `/displays/${username}`,
                  icon: <IconBuildingLighthouse />,
                  isLazyLoaded: true,
                }))
            : []),
        ],
      },
    ],
    [allUsernames, pinnedUsernames, pinnedUsers, searchQuery, showUserDisplays]
  );

  const routes = useMemo<VisibleRoute[]>(
    () => [...(isAdmin ? adminRoutes : []), ...userRoutes],
    [adminRoutes, isAdmin, userRoutes]
  );

  return routes;
}
