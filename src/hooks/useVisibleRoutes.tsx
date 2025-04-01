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

const displaysPath = '/displays';

function displayRoute(username: string): VisibleRoute {
  return {
    type: 'route',
    name: username,
    path: `${displaysPath}/${username}`,
    icon: <IconBuildingLighthouse />,
    contextMenu: <DisplayContextMenu username={username} />,
  };
}

function displayForPath(path: string): string | undefined {
  return path.startsWith(`${displaysPath}/`)
    ? path.substring(displaysPath.length + 1)
    : undefined;
}

export function useVisibleRoutes({
  showUserDisplays = true,
  activePath,
  displaySearchQuery = '',
}: {
  showUserDisplays?: boolean;
  activePath?: string;
  displaySearchQuery?: string;
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
    searchQuery: displaySearchQuery,
  });

  const activeDisplayName = useMemo(
    () => (activePath ? displayForPath(activePath) : undefined),
    [activePath]
  );

  const userRouteItems = useMemo<VisibleRouteItem[]>(
    () => [
      {
        type: 'route',
        name: 'Displays',
        path: displaysPath,
        icon: <IconBuildingLighthouse />,
        children: [
          ...pinnedDisplays.entrySeq().map(([username, pin]) => ({
            ...displayRoute(username),
            label: ({ isActive }: LabelParams) => (
              <DisplayPinLabel isActive={isActive} pin={pin} />
            ),
          })),
          ...(showUserDisplays || displaySearchQuery
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
            : activeDisplayName && !pinnedDisplays.has(activeDisplayName)
              ? [displayRoute(activeDisplayName)]
              : []),
        ],
      },
    ],
    [
      pinnedDisplays,
      showUserDisplays,
      displaySearchQuery,
      filteredUsernames,
      activeDisplayName,
    ]
  );

  const routeItems = useMemo<VisibleRouteItem[]>(
    () => [...(isAdmin ? adminRouteItems : []), ...userRouteItems],
    [adminRouteItems, isAdmin, userRouteItems]
  );

  return routeItems;
}
