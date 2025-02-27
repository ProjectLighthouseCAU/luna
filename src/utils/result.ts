export type Result<T, E = any> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function okResult<T, E>(value: T): Result<T, E> {
  return { ok: true, value };
}

export function errorResult<T, E>(error: E): Result<T, E> {
  return { ok: false, error };
}

export function mapResult<T, E, U>(
  result: Result<T, E>,
  transform: (value: T) => U
): Result<U, E> {
  if (result.ok) {
    return { ok: true, value: transform(result.value) };
  } else {
    return result;
  }
}

export function getOrThrow<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  } else {
    throw result.error;
  }
}
