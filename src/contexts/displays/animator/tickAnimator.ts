import { ModelAPI } from '@luna/contexts/api/model/ModelContext';
import {
  Animator,
  AnimatorAction,
  AnimatorUpdate,
} from '@luna/contexts/displays/animator/types';
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
}): Promise<AnimatorUpdate[]> {
  let animator = initialAnimator;

  if (animator.queue.length > 0) {
    await tickAnimatorAction({
      action: animator.queue[0],
      ...baseProps,
    });

    return [{ type: 'tick' }];
  }

  return [];
}

async function tickAnimatorAction({
  action,
  username,
  api,
}: BaseTickProps & {
  action: AnimatorAction;
}) {
  switch (action.type) {
    case 'setColor':
      const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);
      rgb.fillAt(0, LIGHTHOUSE_WINDOWS, action.color, frame);
      await api.putModel(username, frame);
      break;
    case 'sleep':
      // Do nothing
      break;
  }
}
