/// An RGB color represented as a 32-bit integer.
export type RGBColor = number;

export const BLACK: RGBColor = 0x000000;
export const WHITE: RGBColor = 0xffffff;
export const RED: RGBColor = 0xff0000;
export const GREEN: RGBColor = 0x00ff00;
export const BLUE: RGBColor = 0x0000ff;
export const YELLOW: RGBColor = 0xffff00;
export const CYAN: RGBColor = 0x00ffff;
export const MAGENTA: RGBColor = 0xff00ff;

/// Creates an RGB color from the given red, green and blue components (as bytes between 0-255).
export function rgbColor(red: number, green: number, blue: number): number {
  return (red << 16) | (green << 8) | blue;
}

/// Fetches the red component (a byte in the range 0-255).
export function getRed(color: RGBColor): number {
  return (color >> 16) & 0xff;
}

/// Fetches the green component (a byte in the range 0-255).
export function getGreen(color: RGBColor): number {
  return (color >> 8) & 0xff;
}

/// Fetches the blue component (a byte in the range 0-255).
export function getBlue(color: RGBColor): number {
  return color & 0xff;
}

/// Fetches the `i`th color in the given (interleaved) RGB buffer.
export function getRGBColorAt(i: number, rgbBuffer: Uint8Array): RGBColor {
  return (
    (rgbBuffer[i * 3] << 16) |
    (rgbBuffer[i * 3 + 1] << 8) |
    rgbBuffer[i * 3 + 2]
  );
}

/// Sets the `i`th color to the given value in the given (interleaved) RGB buffer.
export function setRGBColorAt(
  i: number,
  color: RGBColor,
  rgbBuffer: Uint8Array
): void {
  rgbBuffer[i * 3] = (color >> 16) & 0xff;
  rgbBuffer[i * 3 + 1] = (color >> 8) & 0xff;
  rgbBuffer[i * 3 + 2] = color & 0xff;
}

/// Linearly interpolates between two colors.
export function lerp(lhs: RGBColor, rhs: RGBColor, value: number): RGBColor {
  return rgbColor(
    (1 - value) * getRed(lhs) + value * getRed(rhs),
    (1 - value) * getGreen(lhs) + value * getGreen(rhs),
    (1 - value) * getBlue(lhs) + value * getBlue(rhs)
  );
}
