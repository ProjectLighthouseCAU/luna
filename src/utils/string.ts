/**
 * Truncates a string to the given length, appending a suffix.
 */
export function truncate(
  s: string,
  length: number,
  options: { suffix: string } = { suffix: '...' }
): string {
  const innerLength = length - options.suffix.length;
  return s.length <= length
    ? s
    : `${s.substring(0, innerLength)}${options.suffix}`;
}
