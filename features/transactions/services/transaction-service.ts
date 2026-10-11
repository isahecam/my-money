import type * as v from "valibot";

import type { DateRange } from "@/features/dashboard/types";
import { transactionRepository } from "@/features/transactions/repositories/transaction-repository";
import type { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import type { TransactionRepository } from "@/features/transactions/types";
import { toCents } from "@/utils/money";

/** @lintignore */
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
}

export const transactionService = new TransactionService(transactionRepository);
