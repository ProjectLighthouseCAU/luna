import { RouteLink } from '@luna/components/RouteLink';
import { UserSnippet } from '@luna/components/UserSnippet';
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
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const auth = useContext(AuthContext);
  const model = useContext(ModelContext);

  const [searchQuery, setSearchQuery] = useState('');

  return (
    // TODO: This layout is still too long in compact-mode
    <div className="flex flex-col space-y-2 h-full">
      <Input
        startContent={<IconSearch />}
        placeholder="Search displays..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <ScrollShadow className="grow">
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
          {auth.user ? (
            <RouteLink
              icon={<IconBuildingLighthouse />}
              name={`${auth.user.username} (me)`}
              path={`/displays/${auth.user.username}`}
            />
          ) : null}

          {[...model.userModels.keys()]
            .sort()
            .filter(
              username =>
                username !== auth.user?.username &&
                username.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(username => (
              <RouteLink
                key={username}
                icon={<IconBuildingLighthouse />}
                name={truncate(username, 14)}
                path={`/displays/${username}`}
              />
            ))}
        </RouteLink>
      </ScrollShadow>
      <Divider />
      {auth.user ? <UserSnippet user={auth.user} token={auth.token} /> : null}
      <Link onClick={() => auth.client.logOut()} to="/" className="text-danger">
        Sign out
      </Link>
    </div>
  );
}
