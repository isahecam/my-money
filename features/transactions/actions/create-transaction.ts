"use server";

import { returnValidationErrors } from "next-safe-action";
import { refresh } from "next/cache";

import { transactionErrors } from "@/features/transactions/errors";
import { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import { transactionService } from "@/features/transactions/services/transaction-service";
import { authActionClient, returnActionError } from "@/lib/safe-action";

export const createTransaction = authActionClient
  .inputSchema(TransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [error, transaction] = await transactionService.create(ctx.auth.user.id, parsedInput);

    if (error) {
      const { title, description, ...rest } = transactionErrors[error.reason];
      if ("field" in rest) {
        returnValidationErrors(TransactionSchema, { [rest.field]: { _errors: [description] } });
      }
      return returnActionError({ reason: error.reason, message: { title, description } });
    }

    // Re-renders the current page so totals include the new transaction.
    refresh();

    const typeLabel = transaction.type === "expense" ? "gasto" : "ingreso";

    return {
      message: {
        title: "Movimiento registrado",
        description: `Tu ${typeLabel} «${transaction.concept}» se guardó.`,
      },
      payload: transaction,
    };
  });
