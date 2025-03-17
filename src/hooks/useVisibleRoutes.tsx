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

export interface VisibleRoute {
  name: string;
  path: string;
  icon: ReactNode;
  isLazyLoaded: boolean;
  children: VisibleRoute[];
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
        isLazyLoaded: false,
        children: [
          {
            name: 'Resources',
            path: '/admin/resources',
            icon: <IconFolder />,
            isLazyLoaded: false,
            children: [],
          },
          {
            name: 'Monitoring',
            path: '/admin/monitoring',
            icon: <IconHeartRateMonitor />,
            isLazyLoaded: false,
            children: [],
          },
          {
            name: 'Users',
            path: '/admin/users',
            icon: <IconUsers />,
            isLazyLoaded: false,
            children: [],
          },
          {
            name: 'Roles',
            path: '/admin/roles',
            icon: <IconCategory />,
            isLazyLoaded: false,
            children: [],
          },
          {
            name: 'Registration Keys',
            path: '/admin/registration-keys',
            icon: <IconKey />,
            isLazyLoaded: false,
            children: [],
          },
          {
            name: 'Settings',
            path: '/admin/settings',
            icon: <IconSettings />,
            isLazyLoaded: false,
            children: [],
          },
        ],
      },
    ],
    []
  );

  const allUsernames = useJsonMemo([...users.all]);

  const userRoutes = useMemo(
    () => [
      {
        name: 'Displays',
        path: '/displays',
        icon: <IconBuildingLighthouse />,
        isLazyLoaded: false,
        children: [
          ...(user?.username
            ? [
                {
                  name: `${user.username} (me)`,
                  icon: <IconBuildingLighthouse />,
                  path: `/displays/${user.username}`,
                  isLazyLoaded: false,
                  children: [],
                },
              ]
            : []),
          ...(showUserDisplays || searchQuery
            ? allUsernames
                .filter(
                  username =>
                    username !== user?.username &&
                    username.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .sort()
                .map<VisibleRoute>(username => ({
                  name: username,
                  path: `/displays/${username}`,
                  icon: <IconBuildingLighthouse />,
                  isLazyLoaded: true,
                  children: [],
                }))
            : []),
        ],
      },
    ],
    [allUsernames, searchQuery, showUserDisplays, user?.username]
  );

  const routes = useMemo<VisibleRoute[]>(
    () => [...(isAdmin ? adminRoutes : []), ...userRoutes],
    [adminRoutes, isAdmin, userRoutes]
  );

  return routes;
}
