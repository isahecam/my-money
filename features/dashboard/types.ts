import type { resolveDateRange } from "@/features/dashboard/lib/search-params";

/** Complete, ordered range from the URL filters. */
export type DateRange = NonNullable<ReturnType<typeof resolveDateRange>>;

export interface StatisticsRepository {
  /** Income in cents within `range`, or all time when `null`. */
  sumIncome(userId: string, range: DateRange | null): Promise<number>;

  /** Expenses in cents within `range`, or all time when `null`. */
  sumExpenses(userId: string, range: DateRange | null): Promise<number>;
}
