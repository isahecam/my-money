import { and, between, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import type { DateRange, StatisticsRepository } from "@/features/dashboard/types";

/** @lintignore */
export class DrizzleStatisticsRepository implements StatisticsRepository {
  constructor(private readonly database: typeof db) {}

  sumIncome(userId: string, range: DateRange | null) {
    return this.#sumByType(userId, "income", range);
  }

  sumExpenses(userId: string, range: DateRange | null) {
    return this.#sumByType(userId, "expense", range);
  }

  async #sumByType(
    userId: string,
    type: (typeof transactions.$inferSelect)["type"],
    range: DateRange | null,
  ) {
    const [{ total }] = await this.database
      .select({
        // `sum` returns a string, or null without rows.
        total: sql`coalesce(sum(${transactions.amountCents}), 0)`.mapWith(Number),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, type),
          range ? between(transactions.transactionDate, range.from, range.to) : undefined,
        ),
      );
    return total;
  }
}

export const statisticsRepository = new DrizzleStatisticsRepository(db);
