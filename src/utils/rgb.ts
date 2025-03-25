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

/// Fills a range with the given value in the given (interleaved) RGB buffer.
export function fillAt(
  i: number,
  length: number,
  color: Color,
  rgbBuffer: Uint8Array
): void {
  for (let di = 0; di < length; di++) {
    setAt(i + di, color, rgbBuffer);
  }
}

/// Linearly interpolates between two colors.
export function lerp(lhs: Color, rhs: Color, value: number): Color {
  const clampedValue = Math.min(1, Math.max(0, value));
  return color(
    (1 - clampedValue) * getRed(lhs) + clampedValue * getRed(rhs),
    (1 - clampedValue) * getGreen(lhs) + clampedValue * getGreen(rhs),
    (1 - clampedValue) * getBlue(lhs) + clampedValue * getBlue(rhs)
  );
}

/// Linearly interpolates between multiple colors (e.g. a colormap).
export function lerpMultiple(colors: Color[], value: number): Color {
  if (colors.length === 0) {
    throw new Error('Cannot interpolate between an empty array of colors!');
  }
  const position = value * colors.length;
  const i = Math.floor(position);
  if (i < 0) {
    return colors[0];
  }
  if (i >= colors.length - 1) {
    return colors[colors.length - 1];
  }
  const remainder = position - i;
  return lerp(colors[i], colors[i + 1], remainder);
}

/// Scales the given color.
export function scale(c: Color, value: number): Color {
  return color(value * getRed(c), value * getGreen(c), value * getBlue(c));
}

/// Converts the color to a CSS color.
export function asCSS(c: Color): string {
  return `rgb(${getRed(c)},${getGreen(c)},${getBlue(c)})`;
}

/// Converts the color to hexadecimal.
export function asHex(c: Color) {
  return c.toString(16);
}
