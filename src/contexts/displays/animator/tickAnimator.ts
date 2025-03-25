import { ModelAPI } from '@luna/contexts/api/model/ModelContext';
import {
  Animator,
  AnimatorAction,
  AnimatorUpdate,
} from '@luna/contexts/displays/animator/types';
import {
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_FRAME_BYTES,
  LIGHTHOUSE_WINDOWS,
} from 'nighthouse/browser';
import * as rgb from '@luna/utils/rgb';
import {
  fillPixelMapAt,
  Letter,
  PIXEL_ALPHABET,
  PIXEL_MAP_WIDTH,
} from '@luna/utils/pixelAlphabet';

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
  if (action.type === 'sleep') {
    return;
  }

  const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);
  switch (action.type) {
    case 'setColor':
      rgb.fillAt(0, LIGHTHOUSE_WINDOWS, action.color, frame);
      break;
    case 'scrollText':
      const progress = action.ticks.value / action.ticks.total;
      const totalWidth = action.text.length * PIXEL_MAP_WIDTH + LIGHTHOUSE_COLS;

      let x = LIGHTHOUSE_COLS - Math.floor(progress * totalWidth);
      let y = 1;

      for (const letter of action.text) {
        if (letter in PIXEL_ALPHABET) {
          const pixelMap = PIXEL_ALPHABET[letter as Letter];
          // TODO: Make color customizable
          fillPixelMapAt({ x, y }, rgb.WHITE, pixelMap, frame);
          x += pixelMap[0].length;
        }
      }
      break;
  }
  await api.putModel(username, frame);
}
