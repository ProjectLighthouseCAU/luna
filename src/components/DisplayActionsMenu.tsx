import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { UserPinsContext } from '@luna/contexts/displays/UserPinsContext';
import { useAdminStatus } from '@luna/hooks/useAdminStatus';
import { useLiveUser } from '@luna/hooks/useLiveUser';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
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
  const { user: me } = useContext(AuthContext);
  const { api } = useContext(ModelContext);
  const { pinnedUsernames, setPinnedUsernames } = useContext(UserPinsContext);
  const { isAdmin } = useAdminStatus();
  const { setLiveUsername } = useLiveUser();

  const isMe = username === me?.username;

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

  const blackout = useCallback(async () => {
    await api.putModel(username, new Uint8Array(LIGHTHOUSE_FRAME_BYTES));
  }, [api, username]);

  const items = useMemo<DisplayActionMenuItem[]>(
    () => [
      {
        key: 'pin',
        label: `${isPinned ? 'Unpin' : 'Pin'} ${username}`,
        onPress: togglePinned,
      },
      ...(isAdmin || isMe
        ? [
            {
              key: 'blackout',
              onPress: blackout,
              label: 'Blackout',
            },
          ]
        : []),
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
    [blackout, goLive, isAdmin, isMe, isPinned, togglePinned, username]
  );

  return <>{children({ items })}</>;
}
