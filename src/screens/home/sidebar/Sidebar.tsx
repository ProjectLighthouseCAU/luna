import { ColorSchemeButton } from '@luna/components/ColorSchemeButton';
import { SearchBar } from '@luna/components/SearchBar';
import { UserSnippet } from '@luna/components/UserSnippet';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { SearchContext } from '@luna/contexts/displays/SearchContext';
import { SidebarRoutes } from '@luna/screens/home/sidebar/SidebarRoutes';
import {
  Divider,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
} from '@heroui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export interface SidebarProps {
  isCompact: boolean;
}

// TODO: Factor out a generic sidebar component that we could reuse for the
// admin resources view

export function Sidebar({ isCompact }: SidebarProps) {
  const auth = useContext(AuthContext);
  const { query, setQuery } = useContext(SearchContext);
  const navigate = useNavigate();

  const [showQuickSwitcherTip, setShowQuickSwitcherTip] = useState(true);

  const [logoutErrorMessage, setLogoutErrorMessage] = useState<string | null>(
    null
  );

  const logOut = useCallback(async () => {
    const logoutResult = await auth.logOut();
    if (!logoutResult.ok) {
      setLogoutErrorMessage(logoutResult.error);
      return;
    }
    setLogoutErrorMessage(null);
    navigate('/');
  }, [auth, navigate]);

  useEffect(() => {
    if (query || isCompact) {
      setShowQuickSwitcherTip(false);
    }
  }, [isCompact, query]);

  return (
    <div className="flex flex-col space-y-2 h-full">
      <SearchBar
        placeholder="Search displays..."
        fullWidth
        setQuery={setQuery}
        tooltip={
          showQuickSwitcherTip ? (
            <div className="flex flex-col gap-2">
              <span>
                Tip: You can also search quickly using the quick switcher.
              </span>
              <span>
                Press <Kbd>Cmd/Ctrl</Kbd> + <Kbd>K</Kbd> to open it.
              </span>
            </div>
          ) : undefined
        }
        tooltipPlacement="right"
      />
      <ScrollShadow className="grow">
        <SidebarRoutes isCompact={isCompact} searchQuery={query} />
      </ScrollShadow>
      <Divider />
      {auth.user ? <UserSnippet user={auth.user} token={auth.token} /> : null}
      <div className="flex flex-row justify-between items-center">
        <Link onClick={logOut} to="#" className="text-danger">
          Sign out
        </Link>
        <ColorSchemeButton />
      </div>
      <Modal
        isOpen={logoutErrorMessage !== null}
        onOpenChange={isOpen => {
          if (!isOpen) {
            setLogoutErrorMessage(null);
          }
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>{logoutErrorMessage}</ModalHeader>
              <ModalBody>
                <p className="inline">
                  This shouldn't happen, please{' '}
                  <a
                    href="https://github.com/ProjectLighthouseCAU/luna/issues"
                    className="underline"
                  >
                    file a bug on GitHub
                  </a>{' '}
                  and try clearing your cookies!
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
