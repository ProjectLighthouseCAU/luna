import { SearchBar } from '@luna/components/SearchBar';
import { UserSnippet } from '@luna/components/UserSnippet';
import { AuthContext } from '@luna/contexts/AuthContext';
import { SearchContext } from '@luna/contexts/SearchContext';
import { SidebarRoutes } from '@luna/screens/home/sidebar/SidebarRoutes';
import { Divider, ScrollShadow } from '@nextui-org/react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

export interface SidebarProps {
  isCompact: boolean;
}

export function Sidebar({ isCompact }: SidebarProps) {
  const auth = useContext(AuthContext);
  const { query, setQuery } = useContext(SearchContext);

  return (
    // TODO: This layout is still too long in compact-mode
    <div className="flex flex-col space-y-2 h-full">
      <SearchBar
        placeholder="Search displays..."
        query={query}
        setQuery={setQuery}
      />
      <ScrollShadow className="grow">
        <SidebarRoutes isCompact={isCompact} />
      </ScrollShadow>
      <Divider />
      {auth.user ? <UserSnippet user={auth.user} token={auth.token} /> : null}
      <Link onClick={() => auth.client.logOut()} to="/" className="text-danger">
        Sign out
      </Link>
    </div>
  );
}
