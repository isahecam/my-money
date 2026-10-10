import { NeonDbError } from "@neondatabase/serverless";
import { DrizzleQueryError } from "drizzle-orm";

/**
 * Maps a violated Postgres constraint to its business reason.
 *
 * @returns The reason for the constraint, or `undefined` when the error is not a known constraint violation.
 */
export function constraintReason<T extends Record<string, string>>(
  error: unknown,
  constraints: T,
): T[keyof T] | undefined {
  // Drizzle wraps driver errors; the Neon HTTP driver throws `NeonDbError`.
  const cause = error instanceof DrizzleQueryError ? error.cause : error;
  if (!(cause instanceof NeonDbError) || !cause.constraint) return undefined;
  return constraints[cause.constraint as keyof T];
}
