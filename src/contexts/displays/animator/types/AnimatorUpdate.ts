import { Animator } from '@luna/contexts/displays/animator/types/Animator';
import { AnimatorAction } from '@luna/contexts/displays/animator/types/AnimatorAction';

interface BaseAnimatorUpdate<Type extends string> {
  type: Type;
}

export interface AddActionAnimatorUpdate
  extends BaseAnimatorUpdate<'addAction'> {
  action: AnimatorAction;
}

export interface SkipActionAnimatorUpdate
  extends BaseAnimatorUpdate<'skipAction'> {
  direction: 'back' | 'forward';
}

export interface ClearQueueAnimatorUpdate
  extends BaseAnimatorUpdate<'clearQueue'> {}

export interface SetPlayingAnimatorUpdate
  extends BaseAnimatorUpdate<'setPlaying'> {
  isPlaying: boolean;
}

export interface TickAnimatorUpdate extends BaseAnimatorUpdate<'tick'> {}

export type AnimatorUpdate =
  | AddActionAnimatorUpdate
  | SkipActionAnimatorUpdate
  | ClearQueueAnimatorUpdate
  | SetPlayingAnimatorUpdate
  | TickAnimatorUpdate;

export function applyAnimatorUpdate(
  animator: Animator,
  update: AnimatorUpdate
): Animator {
  switch (update.type) {
    case 'addAction':
      return { ...animator, queue: [...animator.queue, update.action] };
    case 'skipAction':
      switch (update.direction) {
        case 'back':
          return {
            ...animator,
            queue: [
              ...animator.history
                .slice(-1)
                .map(a => ({ ...a, ticks: { ...a.ticks, value: 0 } })),
              ...animator.queue.map(a => ({
                ...a,
                ticks: { ...a.ticks, value: 0 },
              })),
            ],
            history: animator.history.slice(0, -1),
          };
        case 'forward':
          return {
            ...animator,
            queue: animator.queue.slice(1),
            history: [...animator.history, ...animator.queue.slice(0, 1)],
          };
      }
      break; // Unreachable
    case 'clearQueue':
      return { ...animator, queue: [], history: [] };
    case 'setPlaying':
      return { ...animator, isPlaying: update.isPlaying };
    case 'tick':
      if (animator.queue.length > 0) {
        const first = animator.queue[0];
        const ticks = first.ticks;
        if (ticks.value < ticks.total) {
          return {
            ...animator,
            queue: [
              {
                ...first,
                ticks: { ...ticks, value: ticks.value + 1 },
              },
              ...animator.queue.slice(1),
            ],
          };
        } else {
          return {
            ...animator,
            queue: animator.queue.slice(1),
            history:
              animator.queue.length > 1
                ? [animator.queue[0], ...animator.history]
                : [], // Clear history after the last action
          };
        }
      } else {
        return animator;
      }
  }
}

export function applyAnimatorUpdates(
  animator: Animator,
  updates: AnimatorUpdate[]
): Animator {
  return updates.reduce(applyAnimatorUpdate, animator);
}
