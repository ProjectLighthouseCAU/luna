import { ModelAPI } from '@luna/contexts/api/model/ModelContext';
import { Animator } from '@luna/contexts/displays/animator/AnimatorContext';
import { AnimatorAction } from '@luna/contexts/displays/animator/types';
import { LIGHTHOUSE_FRAME_BYTES, LIGHTHOUSE_WINDOWS } from 'nighthouse/browser';
import * as rgb from '@luna/utils/rgb';

interface BaseTickProps {
  username: string;
  api: ModelAPI;
}

export async function tickAnimator({
  animator: initialAnimator,
  ...baseProps
}: BaseTickProps & {
  animator: Animator;
}): Promise<Animator> {
  let animator = initialAnimator;

  if (animator.queue.length > 0) {
    const action = await tickAnimatorAction({
      action: animator.queue[0],
      ...baseProps,
    });

    if (action.ticks.value === action.ticks.total) {
      // Dequeue the action
      animator = {
        ...animator,
        queue: animator.queue.slice(1),
      };
    } else {
      // Update the action
      animator = {
        ...animator,
        queue: [action, ...animator.queue.slice(1)],
      };
    }
  }

  return animator;
}

async function tickAnimatorAction({
  action,
  username,
  api,
}: BaseTickProps & {
  action: AnimatorAction;
}): Promise<AnimatorAction> {
  switch (action.type) {
    case 'setColor':
      const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);
      rgb.fillAt(0, LIGHTHOUSE_WINDOWS, action.color, frame);
      await api.putModel(username, frame);
  }

  // Increase ticks
  return {
    ...action,
    ticks: { ...action.ticks, value: action.ticks.value + 1 },
  };
}
