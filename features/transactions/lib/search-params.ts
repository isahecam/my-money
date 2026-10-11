import { createSearchParamsCache, parseAsInteger } from "nuqs/server";

// Imported from `nuqs/server` so both Server and Client Components can share it.
export const searchParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
