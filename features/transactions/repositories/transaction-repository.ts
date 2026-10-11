import { and, between, desc, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import type { DateRange } from "@/features/dashboard/types";
import { transactionConstraints } from "@/features/transactions/errors";
import type {
  NewTransaction,
  TransactionRepository,
  TransactionValues,
} from "@/features/transactions/types";
import { constraintReason } from "@/lib/errors/constraint-reason";
import { err, ok } from "@/lib/errors/result";

// Internal fields are never read back from the database.
const {
  userId: _userId,
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...returnedColumns
} = getTableColumns(transactions);

// `createdAt` breaks ties on the same day; `id` makes the order total, so offset pages
// never repeat or skip rows.
const newestFirst = [
  desc(transactions.transactionDate),
  desc(transactions.createdAt),
  desc(transactions.id),
];

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
    return this.database
      .select(returnedColumns)
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          range ? between(transactions.transactionDate, range.from, range.to) : undefined,
        ),
      )
      .orderBy(...newestFirst)
      .limit(limit);
  }

  findPage(userId: string, limit: number, offset: number) {
    return this.database
      .select(returnedColumns)
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(...newestFirst)
      .limit(limit)
      .offset(offset);
  }

  count(userId: string) {
    return this.database.$count(transactions, eq(transactions.userId, userId));
  }

  async update(userId: string, id: string, values: TransactionValues) {
    try {
      const [transaction] = await this.database
        .update(transactions)
        .set(values)
        .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
        .returning(returnedColumns);
      // No row: it was deleted or belongs to another user.
      if (!transaction) return err({ reason: "TRANSACTION_NOT_FOUND" });
      return ok(transaction);
    } catch (error) {
      const reason = constraintReason(error, transactionConstraints);
      if (reason) return err({ reason });
      // Unknown failures go to `handleServerError`.
      throw error;
    }
  }

  async delete(userId: string, id: string) {
    const [transaction] = await this.database
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning(returnedColumns);
    // No row: it was already deleted or belongs to another user.
    if (!transaction) return err({ reason: "TRANSACTION_NOT_FOUND" });
    return ok(transaction);
  }
}

export const transactionRepository = new DrizzleTransactionRepository(db);
