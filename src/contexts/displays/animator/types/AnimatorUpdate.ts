import { Animator } from '@luna/contexts/displays/animator/types/Animator';
import { AnimatorAction } from '@luna/contexts/displays/animator/types/AnimatorAction';

interface BaseAnimatorUpdate<Type extends string> {
  type: Type;
}

export interface AddActionAnimatorUpdate
  extends BaseAnimatorUpdate<'addAction'> {
  action: AnimatorAction;
}

export interface ClearQueueAnimatorUpdate
  extends BaseAnimatorUpdate<'clearQueue'> {}

export interface TickAnimatorUpdate extends BaseAnimatorUpdate<'tick'> {}

export type AnimatorUpdate =
  | AddActionAnimatorUpdate
  | ClearQueueAnimatorUpdate
  | TickAnimatorUpdate;

export function applyAnimatorUpdate(
  animator: Animator,
  update: AnimatorUpdate
): Animator {
  switch (update.type) {
    case 'addAction':
      return { ...animator, queue: [...animator.queue, update.action] };
    case 'clearQueue':
      return { ...animator, queue: [] };
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
