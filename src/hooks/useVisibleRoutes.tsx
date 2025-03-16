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
        children: [
          {
            name: 'Resources',
            path: '/admin/resources',
            icon: <IconFolder />,
            children: [],
          },
          {
            name: 'Monitoring',
            path: '/admin/monitoring',
            icon: <IconHeartRateMonitor />,
            children: [],
          },
          {
            name: 'Users',
            path: '/admin/users',
            icon: <IconUsers />,
            children: [],
          },
          {
            name: 'Roles',
            path: '/admin/roles',
            icon: <IconCategory />,
            children: [],
          },
          {
            name: 'Registration Keys',
            path: '/admin/registration-keys',
            icon: <IconKey />,
            children: [],
          },
          {
            name: 'Settings',
            path: '/admin/settings',
            icon: <IconSettings />,
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
        children: [
          ...(user?.username
            ? [
                {
                  name: `${user.username} (me)`,
                  icon: <IconBuildingLighthouse />,
                  path: `/displays/${user.username}`,
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
