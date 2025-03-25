import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { tickAnimator } from '@luna/contexts/displays/animator/tickAnimator';
import {
  Animator,
  AnimatorUpdate,
  applyAnimatorUpdate,
  applyAnimatorUpdates,
  emptyAnimator,
} from '@luna/contexts/displays/animator/types';
import { Map } from 'immutable';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface AnimatorContextValue {
  getAnimator: (username: string) => Animator;
  updateAnimator: (username: string, update: AnimatorUpdate) => void;
}

export const AnimatorContext = createContext<AnimatorContextValue>({
  getAnimator: () => emptyAnimator(),
  updateAnimator: () => {},
});

interface AnimatorContextProviderProps {
  children: ReactNode;
}

export function AnimatorContextProvider({
  children,
}: AnimatorContextProviderProps) {
  const [[animators, nextTickUpdates], setState] = useState<
    [Map<string, Animator>, Map<string, AnimatorUpdate[]>]
  >([Map(), Map()]);

  const commitUpdate = useCallback(
    (username: string, update: AnimatorUpdate) => {
      setState(([animators, nextTickUpdates]) => [
        animators.update(username, emptyAnimator(), a =>
          applyAnimatorUpdate(a, update)
        ),
        nextTickUpdates,
      ]);
    },
    []
  );

  const value = useMemo<AnimatorContextValue>(
    () => ({
      getAnimator(username) {
        return applyAnimatorUpdates(
          animators.get(username) ?? emptyAnimator(),
          nextTickUpdates.get(username, [])
        );
      },
      updateAnimator(username, update) {
        commitUpdate(username, update);
      },
    }),
    [animators, commitUpdate, nextTickUpdates]
  );

  const { api } = useContext(ModelContext);

  // The following two effects implicitly implement the tick loop, by
  // alternating between a timeout that commits the nextTickUpdates and an
  // effect that actually ticks the action and computes the new nextTickUpdates.
  // Any consumers of the context will already see the nextTickUpdates-updated
  // animators while the internal state still uses the previous updates to
  // avoid eagerly triggering the next iteration of the tick loop.

  useEffect(() => {
    // Bail out if there are no running updates
    if (!nextTickUpdates.valueSeq().find(us => us.length > 0)) {
      return;
    }

    const tickDelayMs = 100;

    const timeout = window.setTimeout(() => {
      setState(([animators, nextTickUpdates]) => [
        animators.map((a, u) =>
          a.isPlaying ? applyAnimatorUpdates(a, nextTickUpdates.get(u, [])) : a
        ),
        Map(),
      ]);
    }, tickDelayMs);
    return () => window.clearTimeout(timeout);
  }, [nextTickUpdates]);

  useEffect(() => {
    (async () => {
      for (const [username, animator] of animators.entries()) {
        if (animator.isPlaying) {
          const updates = await tickAnimator({ animator, username, api });
          setState(([animators, nextTickUpdates]) => [
            animators,
            nextTickUpdates.update(username, [], us => [...us, ...updates]),
          ]);
        }
      }
    })();
  }, [animators, api]);

  return (
    <AnimatorContext.Provider value={value}>
      {children}
    </AnimatorContext.Provider>
  );
}
