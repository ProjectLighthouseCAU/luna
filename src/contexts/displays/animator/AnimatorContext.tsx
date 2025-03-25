import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { tickAnimator } from '@luna/contexts/displays/animator/run';
import { AnimatorQueue } from '@luna/contexts/displays/animator/types';
import { Map } from 'immutable';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface Animator {
  queue: AnimatorQueue;
}

export function emptyAnimator(): Animator {
  return {
    queue: [],
  };
}

export interface AnimatorContextValue {
  getAnimator: (username: string) => Animator;
  setAnimator: (username: string, animator: Animator) => void;
}

export const AnimatorContext = createContext<AnimatorContextValue>({
  getAnimator: () => emptyAnimator(),
  setAnimator: () => {},
});

interface AnimatorContextProviderProps {
  children: ReactNode;
}

export function AnimatorContextProvider({
  children,
}: AnimatorContextProviderProps) {
  const [animators, setAnimators] = useState<Map<string, Animator>>(Map());

  const value = useMemo<AnimatorContextValue>(
    () => ({
      getAnimator(username) {
        return animators.get(username) ?? emptyAnimator();
      },
      setAnimator(username, animator) {
        setAnimators(animators.set(username, animator));
      },
    }),
    [animators]
  );

  const { api } = useContext(ModelContext);

  useEffect(() => {
    // Bail out if there are no running animations
    if (!animators.valueSeq().find(a => a.queue.length > 0)) {
      return;
    }

    const tickDelayMs = 100;

    // TODO: Return deltas from the ticker to avoid having it override potential changes from the UI
    const timeout = window.setTimeout(async () => {
      let newAnimators = animators;
      for (const [username, animator] of animators.entries()) {
        const newAnimator = await tickAnimator({ animator, username, api });
        newAnimators = newAnimators.set(username, newAnimator);
      }
      setAnimators(newAnimators);
    }, tickDelayMs);

    return () => window.clearTimeout(timeout);
  }, [animators, api]);

  return (
    <AnimatorContext.Provider value={value}>
      {children}
    </AnimatorContext.Provider>
  );
}
