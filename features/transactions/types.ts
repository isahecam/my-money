import type { transactions } from "@/db/schema";
import type { DateRange } from "@/features/dashboard/types";
import type { transactionErrors } from "@/features/transactions/errors";
import type { Result } from "@/lib/errors/result";

export type NewTransaction = typeof transactions.$inferInsert;

/** Transaction without internal fields (`userId`, timestamps), safe to send to the client. */
export type TransactionDto = Omit<
  typeof transactions.$inferSelect,
  "userId" | "createdAt" | "updatedAt"
>;

type TransactionError = { reason: keyof typeof transactionErrors };

export interface TransactionRepository {
  create(values: NewTransaction): Promise<Result<TransactionError, TransactionDto>>;

  /** Up to `limit` transactions within `range` (all time when `null`), most recent first. */
  findLatest(userId: string, range: DateRange | null, limit: number): Promise<TransactionDto[]>;
}
