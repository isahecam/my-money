/**
 * Result pattern as a tuple: the error first, the value second.
 * Only one side is non-null, so callers must check the error before using the value.
 *
 * - `[error, null]`: the operation failed.
 * - `[null, value]`: the operation succeeded.
 */
export type Result<E extends { reason: string }, S> = [E, null] | [null, S];

export function ok<S>(data: S): Result<never, S> {
  return [null, data];
}

export function err<const R extends string, E extends { reason: R }>(error: E): Result<E, never> {
  return [error, null];
}
