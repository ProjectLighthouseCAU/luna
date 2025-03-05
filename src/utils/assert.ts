/// Checks whether a value is nullish.
export function isNullish(value: any): value is null | undefined {
  return value === null || value === undefined;
}

/// Asserts that the value is not nullish.
export function notNullish(
  value: any,
  description: string = 'Value'
): Exclude<typeof value, null | undefined> {
  if (isNullish(value)) {
    throw new Error(`${description} was unexpectedly nullish`);
  }
  return value;
}
