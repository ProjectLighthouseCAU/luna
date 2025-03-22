import {
  GamepadEvent,
  KeyEvent,
  LegacyControllerEvent,
  LegacyKeyEvent,
  MIDIEvent,
  MouseEvent,
} from 'nighthouse/browser';

export interface InputState {
  gamepadCount: number;
  midiInputCount: number;
  lastMouseEvent?: MouseEvent;
  lastKeyEvent?: KeyEvent | LegacyKeyEvent;
  lastControllerEvents?: GamepadEvent[] | LegacyControllerEvent[];
  lastMIDIEvent?: MIDIEvent;
}
