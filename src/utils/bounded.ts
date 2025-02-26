/// A bounded quantity.
export interface Bounded<T> {
  value: T;
  total: T;
}

export function isBounded(value: object): value is Bounded<unknown> {
  return 'value' in value && 'total' in value;
}
