import { DropdownItem, DropdownMenu } from '@heroui/react';
import { UserPinsContext } from '@luna/contexts/displays/UserPinsContext';
import { useCallback, useContext } from 'react';

export interface DisplayContextMenuProps {
  username: string;
}

export function DisplayContextMenu({ username }: DisplayContextMenuProps) {
  const { pinnedUsernames, setPinnedUsernames } = useContext(UserPinsContext);

  const isPinned = pinnedUsernames.contains(username);
  const togglePinned = useCallback(() => {
    setPinnedUsernames(
      isPinned
        ? pinnedUsernames.remove(username)
        : pinnedUsernames.add(username)
    );
  }, [isPinned, pinnedUsernames, setPinnedUsernames, username]);

  return (
    <DropdownMenu>
      <DropdownItem key="pin" onPress={togglePinned}>
        {isPinned ? 'Unpin' : 'Pin'} {username}
      </DropdownItem>
    </DropdownMenu>
  );
}
