import { RouteLink } from '@luna/components/RouteLink';
import { AuthContext } from '@luna/contexts/AuthContext';
import { ModelContext } from '@luna/contexts/ModelContext';
import { Divider } from '@nextui-org/react';
import {
  IconBuildingLighthouse,
  IconHeartRateMonitor,
  IconSettings,
  IconTower,
} from '@tabler/icons-react';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const auth = useContext(AuthContext);
  const model = useContext(ModelContext);

  return (
    <div className="flex flex-col space-y-2">
      <RouteLink icon={<IconTower />} name="Admin" path="/admin">
        <RouteLink
          icon={<IconHeartRateMonitor />}
          name="Monitor"
          path="/admin/monitor"
        />
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
        {auth.username ? (
          <RouteLink
            icon={<IconBuildingLighthouse />}
            name={`${auth.username} (me)`}
            path={`/displays/${auth.username}`}
          />
        ) : null}
        {[...model.userModels.keys()]
          .sort()
          .filter(username => username !== auth.username)
          .map(username => (
            <RouteLink
              icon={<IconBuildingLighthouse />}
              name={username}
              path={`/displays/${username}`}
            />
          ))}
      </RouteLink>
      <Divider />
      <ul>
        <li>
          <Link
            onClick={() => auth.client.logOut()}
            to="/"
            className="text-danger"
          >
            Sign out
          </Link>
        </li>
      </ul>
    </div>
  );
}
