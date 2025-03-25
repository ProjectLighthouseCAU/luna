import { AnimatorHistory } from '@luna/contexts/displays/animator/types/AnimatorHistory';
import { AnimatorQueue } from '@luna/contexts/displays/animator/types/AnimatorQueue';

export interface Animator {
  queue: AnimatorQueue;
  history: AnimatorHistory;
}

export function emptyAnimator(): Animator {
  return {
    queue: [],
    history: [],
  };
}
