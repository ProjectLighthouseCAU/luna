import { UserPinsContext } from '@luna/contexts/displays/UserPinsContext';
import { useAdminStatus } from '@luna/hooks/useAdminStatus';
import { useLiveUser } from '@luna/hooks/useLiveUser';
import { ReactNode, useCallback, useContext, useMemo } from 'react';

export interface DisplayActionMenuItem {
  key: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

export interface DisplayActionsMenuProps {
  username: string;
  children: (params: { items: DisplayActionMenuItem[] }) => ReactNode;
}

export function DisplayActionsMenu({
  username,
  children,
}: DisplayActionsMenuProps) {
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

  const items = useMemo<DisplayActionMenuItem[]>(
    () => [
      {
        key: 'pin',
        label: `${isPinned ? 'Unpin' : 'Pin'} ${username}`,
        onPress: togglePinned,
      },
      ...(isAdmin
        ? [
            {
              key: 'live',
              onPress: goLive,
              label: `Set ${username} to Live`,
              danger: true,
            },
          ]
        : []),
    ],
    [goLive, isAdmin, isPinned, togglePinned, username]
  );

  return <>{children({ items })}</>;
}
