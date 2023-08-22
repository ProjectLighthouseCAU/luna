import { RouteLink } from '@luna/components/RouteLink';
import { AuthContext } from '@luna/contexts/AuthContext';
import { ModelContext } from '@luna/contexts/ModelContext';
import { truncate } from '@luna/utils/string';
import { Divider, Input, ScrollShadow } from '@nextui-org/react';
import {
  IconBuildingLighthouse,
  IconHeartRateMonitor,
  IconSearch,
  IconSettings,
  IconTower,
} from '@tabler/icons-react';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const auth = useContext(AuthContext);
  const model = useContext(ModelContext);

  const [searchQuery, setSearchQuery] = useState('');

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
        {/* TODO: Figure out a good height */}
        {/* TODO: Deal with x-overflow */}
        <Input
          startContent={<IconSearch />}
          placeholder="Search displays..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <ScrollShadow className="h-64">
          {[...model.userModels.keys()]
            .sort()
            .filter(
              username =>
                username !== auth.username && username.includes(searchQuery)
            )
            .map(username => (
              <RouteLink
                icon={<IconBuildingLighthouse />}
                name={truncate(username, 14)}
                path={`/displays/${username}`}
              />
            ))}
        </ScrollShadow>
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
