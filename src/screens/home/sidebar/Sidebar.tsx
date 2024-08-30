import { SearchBar } from '@luna/components/SearchBar';
import { UserSnippet } from '@luna/components/UserSnippet';
import { AuthContext } from '@luna/contexts/AuthContext';
import { ModelContext } from '@luna/contexts/ModelContext';
import { SearchContext } from '@luna/contexts/SearchContext';
import { SidebarRoutes } from '@luna/screens/home/sidebar/SidebarRoutes';
import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
} from '@nextui-org/react';
import { useCallback, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export interface SidebarProps {
  isCompact: boolean;
}

// TODO: Factor out a generic sidebar component that we could reuse for the
// admin resources view

export function Sidebar({ isCompact }: SidebarProps) {
  const auth = useContext(AuthContext);
  const model = useContext(ModelContext);
  const { query, setQuery } = useContext(SearchContext);
  const navigate = useNavigate();

  const [logOutFailed, setLogOutFailed] = useState(false);

  const logOut = useCallback(async () => {
    const success = await auth.logOut();
    setLogOutFailed(!success);
    if (success) {
      navigate('/');
    }
  }, [auth, navigate]);

  return (
    <div className="flex flex-col space-y-2 h-full">
      <SearchBar placeholder="Search displays..." setQuery={setQuery} />
      <ScrollShadow className="grow">
        <SidebarRoutes
          isCompact={isCompact}
          searchQuery={query}
          user={auth.user ?? undefined}
          allUsernames={[...model.users.models.keys()]}
        />
      </ScrollShadow>
      <Divider />
      {auth.user ? <UserSnippet user={auth.user} token={auth.token} /> : null}
      <Link onClick={logOut} to="#" className="text-danger">
        Sign out
      </Link>
      <Modal isOpen={logOutFailed} onOpenChange={setLogOutFailed}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>Logout</ModalHeader>
              <ModalBody>Could not sign out, please try again later!</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
