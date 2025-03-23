export function addAny<T>(lhs: T, rhs: T): T {
  if (lhs !== null && rhs !== null) {
    if (typeof lhs === 'object' && typeof rhs === 'object') {
      const sum = { ...lhs };
      for (const key in lhs) {
        sum[key] = addAny(lhs[key] as any, rhs[key] as any);
      }
      return sum;
    } else if (typeof lhs === 'number' && typeof rhs === 'number') {
      return (lhs + rhs) as T;
    }
  }
  return rhs;
}
