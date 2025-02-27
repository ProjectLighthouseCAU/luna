/// An RGB color represented as a 32-bit integer.
export type Color = number;

export const BLACK: Color = 0x000000;
export const WHITE: Color = 0xffffff;
export const RED: Color = 0xff0000;
export const GREEN: Color = 0x00ff00;
export const BLUE: Color = 0x0000ff;
export const YELLOW: Color = 0xffff00;
export const CYAN: Color = 0x00ffff;
export const MAGENTA: Color = 0xff00ff;

/// Creates an RGB color from the given red, green and blue components (as bytes between 0-255).
export function color(red: number, green: number, blue: number): number {
  return (red << 16) | (green << 8) | blue;
}

/// Fetches the red component (a byte in the range 0-255).
export function getRed(color: Color): number {
  return (color >> 16) & 0xff;
}

/// Fetches the green component (a byte in the range 0-255).
export function getGreen(color: Color): number {
  return (color >> 8) & 0xff;
}

/// Fetches the blue component (a byte in the range 0-255).
export function getBlue(color: Color): number {
  return color & 0xff;
}

/// Fetches the `i`th color in the given (interleaved) RGB buffer.
export function getAt(i: number, rgbBuffer: Uint8Array): Color {
  return (
    (rgbBuffer[i * 3] << 16) |
    (rgbBuffer[i * 3 + 1] << 8) |
    rgbBuffer[i * 3 + 2]
  );
}

/// Sets the `i`th color to the given value in the given (interleaved) RGB buffer.
export function setAt(i: number, color: Color, rgbBuffer: Uint8Array): void {
  rgbBuffer[i * 3] = (color >> 16) & 0xff;
  rgbBuffer[i * 3 + 1] = (color >> 8) & 0xff;
  rgbBuffer[i * 3 + 2] = color & 0xff;
}

/// Linearly interpolates between two colors.
export function lerp(lhs: Color, rhs: Color, value: number): Color {
  return color(
    (1 - value) * getRed(lhs) + value * getRed(rhs),
    (1 - value) * getGreen(lhs) + value * getGreen(rhs),
    (1 - value) * getBlue(lhs) + value * getBlue(rhs)
  );
}
