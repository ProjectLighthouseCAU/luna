import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { useLiveUser } from '@luna/hooks/useLiveUser';
import { OrderedMap } from 'immutable';
import { useContext, useMemo } from 'react';

export type DisplayPins = OrderedMap<string, DisplayPin>;

export interface DisplayPin {
  me?: boolean;
  live?: boolean;
}

export function usePinnedDisplays(): DisplayPins {
  const auth = useContext(AuthContext);
  const { liveUsername } = useLiveUser();

  const pins = useMemo(() => {
    let pins: DisplayPins = OrderedMap();
    if (auth.user) {
      pins = pins.update(auth.user.username, {}, pin => ({ ...pin, me: true }));
    }
    if (liveUsername) {
      pins = pins.update(liveUsername, {}, pin => ({ ...pin, live: true }));
    }
    return pins;
  }, [auth.user, liveUsername]);

  return pins;
}
