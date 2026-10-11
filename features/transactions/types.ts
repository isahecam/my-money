import type { transactions } from "@/db/schema";
import type { DateRange } from "@/features/dashboard/types";
import type { transactionErrors } from "@/features/transactions/errors";
import type { Result } from "@/lib/errors/result";

export type NewTransaction = typeof transactions.$inferInsert;

/** Columns the user can edit; `userId` and generated fields stay out. */
export type TransactionValues = Omit<NewTransaction, "id" | "userId" | "createdAt" | "updatedAt">;

/** Transaction without internal fields (`userId`, timestamps), safe to send to the client. */
export type TransactionDto = Omit<
  typeof transactions.$inferSelect,
  "userId" | "createdAt" | "updatedAt"
>;

type TransactionError = { reason: keyof typeof transactionErrors };

/** Page requested through the URL, 1-based. */
export type Pagination = { page: number; pageSize: number };

export interface TransactionRepository {
  create(values: NewTransaction): Promise<Result<TransactionError, TransactionDto>>;

  /** Up to `limit` transactions within `range` (all time when `null`), most recent first. */
  findLatest(userId: string, range: DateRange | null, limit: number): Promise<TransactionDto[]>;

  /** Up to `limit` transactions after skipping `offset`, most recent first. */
  findPage(userId: string, limit: number, offset: number): Promise<TransactionDto[]>;

  count(userId: string): Promise<number>;

  /** Updates the transaction only if it belongs to `userId`. */
  update(
    userId: string,
    id: string,
    values: TransactionValues,
  ): Promise<Result<TransactionError, TransactionDto>>;

  /** Deletes the transaction only if it belongs to `userId`. */
  delete(
    userId: string,
    id: string,
  ): Promise<Result<{ reason: "TRANSACTION_NOT_FOUND" }, TransactionDto>>;
}
