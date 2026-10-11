import { useQueryStates } from "nuqs";
import type { Options } from "nuqs";

import { searchParams } from "@/features/transactions/lib/search-params";

// `shallow: false` re-renders the Server Components that read the filters.
export const useFilters = (options: Options = {}) =>
  useQueryStates(searchParams, {
    ...options,
    shallow: false,
  });
