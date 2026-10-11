"use server";

import { refresh } from "next/cache";

import { transactionErrors } from "@/features/transactions/errors";
import { DeleteTransactionSchema } from "@/features/transactions/schemas/transaction-db-schema";
import { transactionService } from "@/features/transactions/services/transaction-service";
import { authActionClient, returnActionError } from "@/lib/safe-action";

export const deleteTransaction = authActionClient
  .inputSchema(DeleteTransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [error, transaction] = await transactionService.delete(ctx.auth.user.id, parsedInput.id);

    if (error) {
      const { title, description } = transactionErrors[error.reason];
      return returnActionError({ reason: error.reason, message: { title, description } });
    }

    // Re-renders the current page so the table and totals drop the transaction.
    refresh();

    const typeLabel = transaction.type === "expense" ? "gasto" : "ingreso";

    return {
      message: {
        title: "Movimiento eliminado",
        description: `Tu ${typeLabel} «${transaction.concept}» se eliminó.`,
      },
      payload: transaction,
    };
  });
