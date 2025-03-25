import { Color } from '@luna/utils/rgb';
import { Map } from 'immutable';
import { ReactNode, createContext, useMemo, useState } from 'react';

interface BaseAnimatorAction<Type extends string> {
  type: Type;
  id: string;
}

export interface SetColorAnimatorAction extends BaseAnimatorAction<'setColor'> {
  color: Color;
}

export type AnimatorAction = SetColorAnimatorAction;
export type AnimatorQueue = AnimatorAction[];

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

  return (
    <AnimatorContext.Provider value={value}>
      {children}
    </AnimatorContext.Provider>
  );
}
