import { DropdownItem, DropdownMenu } from '@heroui/react';
import { UserPinsContext } from '@luna/contexts/displays/UserPinsContext';
import { useAdminStatus } from '@luna/hooks/useAdminStatus';
import { useLiveUser } from '@luna/hooks/useLiveUser';
import { useCallback, useContext } from 'react';

export interface DisplayContextMenuProps {
  username: string;
}

export function DisplayContextMenu({ username }: DisplayContextMenuProps) {
  const { pinnedUsernames, setPinnedUsernames } = useContext(UserPinsContext);
  const { isAdmin } = useAdminStatus();
  const { setLiveUsername } = useLiveUser();

  const isPinned = pinnedUsernames.contains(username);
  const togglePinned = useCallback(() => {
    setPinnedUsernames(
      isPinned
        ? pinnedUsernames.remove(username)
        : pinnedUsernames.add(username)
    );
  }, [isPinned, pinnedUsernames, setPinnedUsernames, username]);

  const goLive = useCallback(() => {
    setLiveUsername(username);
  }, [setLiveUsername, username]);

  return (
    <DropdownMenu>
      <DropdownItem key="pin" onPress={togglePinned}>
        {isPinned ? 'Unpin' : 'Pin'} {username}
      </DropdownItem>
      {isAdmin ? (
        <DropdownItem
          key="live"
          onPress={goLive}
          className="text-danger"
          color="danger"
        >
          Set {username} to Live
        </DropdownItem>
      ) : null}
    </DropdownMenu>
  );
}
