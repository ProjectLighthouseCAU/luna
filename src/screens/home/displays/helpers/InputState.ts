import {
  GamepadEvent,
  KeyEvent,
  LegacyControllerEvent,
  LegacyKeyEvent,
  MIDIEvent,
  MotionEvent,
  MouseEvent,
  OrientationEvent,
} from 'nighthouse/browser';

export interface InputState {
  gamepadCount: number;
  midiInputCount: number;
  lastMouseEvent?: MouseEvent;
  lastKeyEvent?: KeyEvent | LegacyKeyEvent;
  lastControllerEvents?: GamepadEvent[] | LegacyControllerEvent[];
  lastMIDIEvent?: MIDIEvent;
  lastOrientationEvent?: OrientationEvent;
  lastMotionEvent?: MotionEvent;
}
