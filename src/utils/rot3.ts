export interface Rot3<T> {
  alpha: T;
  beta: T;
  gamma: T;
}

export function isInstance(value: any): value is Rot3<unknown> {
  return 'alpha' in value && 'beta' in value && 'gamma' in value;
}
