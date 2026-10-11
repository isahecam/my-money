import type * as v from "valibot";

import type { DateRange } from "@/features/dashboard/types";
import { transactionRepository } from "@/features/transactions/repositories/transaction-repository";
import type { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import type { Pagination, TransactionRepository } from "@/features/transactions/types";
import { toCents } from "@/utils/money";

const MAX_PAGE_SIZE = 50;

export class TransactionService {
  constructor(private readonly repository: TransactionRepository) {}

  /** `userId` must come from the session, never from client input. */
  create(userId: string, input: v.InferOutput<typeof TransactionSchema>) {
    const { amount, ...rest } = input;
    return this.repository.create({
      ...rest,
      amountCents: toCents(amount),
      userId,
      expenseType: input.type === "expense" ? input.expenseType : null,
    });
  }

  /** The 10 most recent transactions within `range`, or all time when `null`. */
  getLatest(userId: string, range: DateRange | null) {
    return this.repository.findLatest(userId, range, 10);
  }

  /**
   * One page of transactions plus the total count. `page` and `pageSize` come from the URL, so
   * they're clamped (page from 1 to the last page, size 1–50) and returned for the table to show
   * what was read.
   */
  async getPage(userId: string, pagination: Pagination) {
    const pageSize = Math.min(Math.max(pagination.pageSize, 1), MAX_PAGE_SIZE);

    // The count goes first so a page past the end (e.g. after deleting its last row) falls back
    // to the last page instead of an empty one.
    const total = await this.repository.count(userId);
    const lastPage = Math.max(Math.ceil(total / pageSize), 1);
    const page = Math.min(Math.max(pagination.page, 1), lastPage);

    const data = await this.repository.findPage(userId, pageSize, (page - 1) * pageSize);

    return { data, total, page, pageSize };
  }

  /** `userId` must come from the session, so users can only delete their own transactions. */
  delete(userId: string, id: string) {
    return this.repository.delete(userId, id);
  }
}

export const transactionService = new TransactionService(transactionRepository);
