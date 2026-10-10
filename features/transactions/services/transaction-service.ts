import type * as v from "valibot";

import { transactionRepository } from "@/features/transactions/repositories/transaction-repository";
import type { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import type { TransactionRepository } from "@/features/transactions/types";

/** @lintignore */
export class TransactionService {
  constructor(private readonly repository: TransactionRepository) {}

  /** `userId` must come from the session, never from client input. */
  create(userId: string, input: v.InferOutput<typeof TransactionSchema>) {
    return this.repository.create({
      ...input,
      userId,
      expenseType: input.type === "expense" ? input.expenseType : null,
    });
  }
}

export const transactionService = new TransactionService(transactionRepository);
