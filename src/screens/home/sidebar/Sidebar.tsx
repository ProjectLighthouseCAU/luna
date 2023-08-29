import { UserSnippet } from '@luna/components/UserSnippet';
import { AuthContext } from '@luna/contexts/AuthContext';
import { SearchContextProvider } from '@luna/contexts/SearchContext';
import { SidebarRoutes } from '@luna/screens/home/sidebar/SidebarRoutes';
import { Divider, Input, ScrollShadow } from '@nextui-org/react';
import { IconSearch } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

export interface SidebarProps {
  isCompact: boolean;
}

export function Sidebar({ isCompact }: SidebarProps) {
  const auth = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');

  return (
    // TODO: This layout is still too long in compact-mode
    <SearchContextProvider query={searchQuery}>
      <div className="flex flex-col space-y-2 h-full">
        <Input
          startContent={<IconSearch />}
          placeholder="Search displays..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <ScrollShadow className="grow">
          <SidebarRoutes isCompact={isCompact} />
        </ScrollShadow>
        <Divider />
        {auth.user ? <UserSnippet user={auth.user} token={auth.token} /> : null}
        <Link
          onClick={() => auth.client.logOut()}
          to="/"
          className="text-danger"
        >
          Sign out
        </Link>
      </div>
    </SearchContextProvider>
  );
}
