import { AnimatorContext } from '@luna/contexts/displays/animator/AnimatorContext';
import { AnimatorUpdate } from '@luna/contexts/displays/animator/types';
import { useCallback, useContext, useMemo } from 'react';

export function useAnimator({ username }: { username: string }) {
  const { getAnimator, updateAnimator } = useContext(AnimatorContext);

  const userAnimator = useMemo(
    () => getAnimator(username),
    [getAnimator, username]
  );

  const updateUserAnimator = useCallback(
    (update: AnimatorUpdate) => updateAnimator(username, update),
    [updateAnimator, username]
  );

  return [userAnimator, updateUserAnimator] as const;
}
