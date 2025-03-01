/** A snapshot of a gamepad's state. */
export interface GamepadState {
  /** The button states on the gamepad. */
  buttons: { pressed: boolean; value: number }[];
  /** The axis states on the gamepad. */
  axes: number[];
}

interface BaseGamepadChange<Control extends string> {
  /** The index of the gamepad that triggered the change. */
  source: number;
  /** The control type. */
  control: Control;
  /** The control-specific index (e.g. of the button or axis). */
  index: number;
}

/** A change of a button on a gamepad. */
export interface GamepadButtonChange extends BaseGamepadChange<'button'> {
  /** Whether the button was pressed. */
  down: boolean;
  /** The value of the button (0.0 to 1.0). */
  value: number;
}

/** A change of an axis on a gamepad. */
export interface GamepadAxisChange extends BaseGamepadChange<'axis'> {
  /** The value of the axis (-1.0 to 1.0). */
  value: number;
}

/** A change on the gamepad. */
export type GamepadChange = GamepadButtonChange | GamepadAxisChange;

/** Captures the states of the connected gamepads. */
export function captureGamepadStates(): GamepadState[] {
  const gamepads = navigator.getGamepads();
  const states: GamepadState[] = [];
  for (let i = 0; i < gamepads.length; i++) {
    const gamepad = gamepads[i];
    const state: GamepadState = {
      buttons:
        gamepad?.buttons.map(b => ({
          pressed: b.pressed,
          value: b.value,
        })) ?? [],
      axes: gamepad?.axes.map(a => a) ?? [],
    };
    states.push(state);
  }
  return states;
}

/** Computes the difference between the given last and current states. */
export function diffGamepadStates(
  lastStates: GamepadState[],
  states: GamepadState[]
): GamepadChange[] {
  const changes: GamepadChange[] = [];
  const totalGamepadCount = Math.max(lastStates.length, states.length);

  for (let i = 0; i < totalGamepadCount; i++) {
    const lastState = i < lastStates.length ? lastStates[i] : undefined;
    const state = i < states.length ? states[i] : undefined;

    const buttonCount = Math.max(
      lastState?.buttons.length ?? 0,
      state?.buttons.length ?? 0
    );
    const axisCount = Math.max(
      lastState?.axes.length ?? 0,
      state?.axes.length ?? 0
    );

    // Diff buttons
    for (let buttonIdx = 0; buttonIdx < buttonCount; buttonIdx++) {
      const lastButton = lastState?.buttons[buttonIdx];
      const button = state?.buttons[buttonIdx];
      if (JSON.stringify(lastButton) !== JSON.stringify(button)) {
        changes.push({
          source: i,
          control: 'button',
          index: buttonIdx,
          down: button?.pressed ?? false,
          value: button?.value ?? 0,
        });
      }
    }

    // Diff axes
    for (let axisIdx = 0; axisIdx < axisCount; axisIdx++) {
      const lastAxis = lastState?.axes[axisIdx];
      const axis = state?.axes[axisIdx];
      if (lastAxis !== axis) {
        changes.push({
          source: i,
          control: 'axis',
          index: axisIdx,
          value: axis ?? 0,
        });
      }
    }
  }

  return changes;
}
