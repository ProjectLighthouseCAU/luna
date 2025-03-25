import { Color } from '@luna/utils/rgb';
import { Map } from 'immutable';
import { ReactNode, createContext, useMemo, useState } from 'react';

interface BaseAnimatorAction<Type extends string> {
  type: Type;
}

export interface SetColorAnimatorAction extends BaseAnimatorAction<'setColor'> {
  color: Color;
}

export type AnimatorAction = SetColorAnimatorAction;
export type AnimatorQueue = AnimatorAction[];

export interface AnimatorContextValue {
  getQueue: (username: string) => AnimatorQueue;
  setQueue: (username: string, queue: AnimatorQueue) => void;
}

export const AnimatorContext = createContext<AnimatorContextValue>({
  getQueue: () => [],
  setQueue: () => {},
});

interface AnimatorContextProviderProps {
  children: ReactNode;
}

export function AnimatorContextProvider({
  children,
}: AnimatorContextProviderProps) {
  const [queues, setQueues] = useState<Map<string, AnimatorQueue>>(Map());

  const value = useMemo<AnimatorContextValue>(
    () => ({
      getQueue(username) {
        return queues.get(username, []);
      },
      setQueue(username, queue) {
        setQueues(queues.set(username, queue));
      },
    }),
    [queues]
  );

  return (
    <AnimatorContext.Provider value={value}>
      {children}
    </AnimatorContext.Provider>
  );
}
