import { and, between, desc, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import type { DateRange } from "@/features/dashboard/types";
import { transactionConstraints } from "@/features/transactions/errors";
import type { NewTransaction, TransactionRepository } from "@/features/transactions/types";
import { constraintReason } from "@/lib/errors/constraint-reason";
import { err, ok } from "@/lib/errors/result";

// Internal fields are never read back from the database.
const {
  userId: _userId,
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...returnedColumns
} = getTableColumns(transactions);

/** @lintignore */
export class DrizzleTransactionRepository implements TransactionRepository {
  constructor(private readonly database: typeof db) {}

  async create(values: NewTransaction) {
    try {
      const [transaction] = await this.database
        .insert(transactions)
        .values(values)
        .returning(returnedColumns);
      return ok(transaction);
    } catch (error) {
      const reason = constraintReason(error, transactionConstraints);
      if (reason) return err({ reason });
      // Unknown failures go to `handleServerError`.
      throw error;
    }
  }

  findLatest(userId: string, range: DateRange | null, limit: number) {
    return (
      this.database
        .select(returnedColumns)
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            range ? between(transactions.transactionDate, range.from, range.to) : undefined,
          ),
        )
        // `createdAt` breaks ties between transactions on the same day.
        .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
        .limit(limit)
    );
  }
}

export const transactionRepository = new DrizzleTransactionRepository(db);
