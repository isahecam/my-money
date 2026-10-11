import { createParser, createSearchParamsCache, type inferParserType } from "nuqs/server";

import { dt } from "@/lib/date";

/**
 * `YYYY-MM-DD` kept as a string, unlike `parseAsIsoDate`, which returns a `Date` at UTC midnight
 * and shifts the day in time zones behind UTC. Impossible dates (e.g. `2026-02-30`) parse to `null`.
 */
export const parseAsDateString = createParser({
  parse: (value) => (dt.isValid(value) ? value : null),
  serialize: (value: string) => value,
});

// Imported from `nuqs/server` so both Server and Client Components can share it.
export const searchParams = {
  from: parseAsDateString,
  to: parseAsDateString,
};

export type SearchParams = inferParserType<typeof searchParams>;

export const searchParamsCache = createSearchParamsCache(searchParams);

/** The range to filter by, or `null` (all time) when it's incomplete or reversed. */
export function resolveDateRange({ from, to }: SearchParams) {
  if (!from || !to || dt.isAfter(from, to)) return null;
  return { from, to };
}
