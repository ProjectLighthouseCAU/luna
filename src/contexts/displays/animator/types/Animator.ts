import { AnimatorQueue } from '@luna/contexts/displays/animator/types/AnimatorQueue';

export interface Animator {
  queue: AnimatorQueue;
}

export function emptyAnimator(): Animator {
  return {
    queue: [],
  };
}
