import {
  GamepadEvent,
  KeyEvent,
  LegacyControllerEvent,
  LegacyKeyEvent,
  MouseEvent,
} from 'nighthouse/browser';

export interface InputState {
  gamepadCount?: number;
  lastMouseEvent?: MouseEvent;
  lastKeyEvent?: KeyEvent | LegacyKeyEvent;
  lastControllerEvent?: GamepadEvent | LegacyControllerEvent;
}
