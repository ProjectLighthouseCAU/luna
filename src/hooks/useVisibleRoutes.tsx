import { DisplayContextMenu } from '@luna/components/DisplayContextMenu';
import { DisplayPinLabel } from '@luna/components/DisplayPinLabel';
import { useAdminStatus } from '@luna/hooks/useAdminStatus';
import { useFilteredDisplays } from '@luna/hooks/useFilteredDisplays';
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
import { ReactNode, useMemo } from 'react';

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
  contextMenu?: ReactNode;
  isLazyLoaded?: boolean;
  children?: VisibleRouteItem[];
}

export interface VisibleDivider extends BaseVisibleItem<'divider'> {}

export type VisibleRouteItem = VisibleRoute | VisibleDivider;

function displayRoute(username: string): VisibleRoute {
  return {
    type: 'route',
    name: username,
    path: `/displays/${username}`,
    icon: <IconBuildingLighthouse />,
    contextMenu: <DisplayContextMenu username={username} />,
  };
}

export function useVisibleRoutes({
  showUserDisplays = true,
  searchQuery = '',
}: {
  showUserDisplays?: boolean;
  searchQuery?: string;
}) {
  const { isAdmin } = useAdminStatus();

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

  const { pinnedDisplays, filteredUsernames } = useFilteredDisplays({
    searchQuery,
  });

  const userRouteItems = useMemo<VisibleRouteItem[]>(
    () => [
      {
        type: 'route',
        name: 'Displays',
        path: '/displays',
        icon: <IconBuildingLighthouse />,
        children: [
          ...pinnedDisplays.entrySeq().map(([username, pin]) => ({
            ...displayRoute(username),
            label: ({ isActive }: LabelParams) => (
              <DisplayPinLabel isActive={isActive} pin={pin} />
            ),
          })),
          ...(showUserDisplays || searchQuery
            ? [
                ...(pinnedDisplays.size > 0 && filteredUsernames.length > 0
                  ? [
                      {
                        type: 'divider' as const,
                        name: 'Pinned Users Divider',
                      },
                    ]
                  : []),
                ...filteredUsernames.map<VisibleRouteItem>(username => ({
                  ...displayRoute(username),
                  isLazyLoaded: true,
                })),
              ]
            : []),
        ],
      },
    ],
    [pinnedDisplays, filteredUsernames, searchQuery, showUserDisplays]
  );

  const routeItems = useMemo<VisibleRouteItem[]>(
    () => [...(isAdmin ? adminRouteItems : []), ...userRouteItems],
    [adminRouteItems, isAdmin, userRouteItems]
  );

  return routeItems;
}
