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

interface BaseVisibleItem<Type extends string> {
  type: Type;
  name: string;
}

export interface VisibleRoute extends BaseVisibleItem<'route'> {
  path: string;
  icon: ReactNode;
  label?: (params: LabelParams) => ReactNode;
  isLazyLoaded?: boolean;
  children?: VisibleRouteItem[];
}

export interface VisibleDivider extends BaseVisibleItem<'divider'> {}

export type VisibleRouteItem = VisibleRoute | VisibleDivider;

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

  const adminRouteItems = useMemo<VisibleRouteItem[]>(
    () => [
      {
        type: 'route',
        name: 'Admin',
        path: '/admin',
        icon: <IconTower />,
        children: [
          {
            type: 'route',
            name: 'Resources',
            path: '/admin/resources',
            icon: <IconFolder />,
          },
          {
            type: 'route',
            name: 'Monitoring',
            path: '/admin/monitoring',
            icon: <IconHeartRateMonitor />,
          },
          {
            type: 'route',
            name: 'Users',
            path: '/admin/users',
            icon: <IconUsers />,
          },
          {
            type: 'route',
            name: 'Roles',
            path: '/admin/roles',
            icon: <IconCategory />,
          },
          {
            type: 'route',
            name: 'Registration Keys',
            path: '/admin/registration-keys',
            icon: <IconKey />,
          },
          {
            type: 'route',
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

  const remainingUsernames = useMemo(
    () =>
      allUsernames
        .filter(
          username =>
            !pinnedUsernames.contains(username) &&
            username.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort(),
    [allUsernames, pinnedUsernames, searchQuery]
  );

  const userRouteItems = useMemo<VisibleRouteItem[]>(
    () => [
      {
        type: 'route',
        name: 'Displays',
        path: '/displays',
        icon: <IconBuildingLighthouse />,
        children: [
          ...pinnedUsers.map(pinned => ({
            type: 'route' as const,
            name: pinned.username,
            icon: <IconBuildingLighthouse />,
            label: pinned.label,
            path: `/displays/${pinned.username}`,
          })),
          ...(showUserDisplays || searchQuery
            ? [
                ...(pinnedUsers.length > 0 && remainingUsernames.length > 0
                  ? [
                      {
                        type: 'divider' as const,
                        name: 'Pinned Users Divider',
                      },
                    ]
                  : []),
                ...remainingUsernames.map<VisibleRouteItem>(username => ({
                  type: 'route',
                  name: username,
                  path: `/displays/${username}`,
                  icon: <IconBuildingLighthouse />,
                  isLazyLoaded: true,
                })),
              ]
            : []),
        ],
      },
    ],
    [pinnedUsers, remainingUsernames, searchQuery, showUserDisplays]
  );

  const routeItems = useMemo<VisibleRouteItem[]>(
    () => [...(isAdmin ? adminRouteItems : []), ...userRouteItems],
    [adminRouteItems, isAdmin, userRouteItems]
  );

  return routeItems;
}
