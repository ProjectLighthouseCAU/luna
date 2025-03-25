import {
  Animator,
  AnimatorContext,
} from '@luna/contexts/displays/AnimatorContext';
import { useCallback, useContext, useMemo } from 'react';

export function useAnimator({ username }: { username: string }) {
  const { getAnimator, setAnimator } = useContext(AnimatorContext);

  const userAnimator = useMemo(
    () => getAnimator(username),
    [getAnimator, username]
  );

  const setUserAnimator = useCallback(
    (animator: Animator) => setAnimator(username, animator),
    [setAnimator, username]
  );

  return [userAnimator, setUserAnimator] as const;
}
