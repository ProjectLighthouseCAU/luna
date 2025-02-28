import {
  GamepadEvent,
  KeyEvent,
  LegacyControllerEvent,
  LegacyKeyEvent,
  MouseEvent,
} from 'nighthouse/browser';

export interface InputState {
  lastMouseEvent?: MouseEvent;
  lastKeyEvent?: KeyEvent | LegacyKeyEvent;
  lastControllerEvent?: GamepadEvent | LegacyControllerEvent;
}
