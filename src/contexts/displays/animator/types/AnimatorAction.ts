import { Bounded } from '@luna/utils/bounded';
import { Color } from '@luna/utils/rgb';

interface BaseAnimatorAction<Type extends string> {
  type: Type;
  id: string;
  ticks: Bounded<number>;
}

export interface SetColorAnimatorAction extends BaseAnimatorAction<'setColor'> {
  color: Color;
}

export type AnimatorAction = SetColorAnimatorAction;
