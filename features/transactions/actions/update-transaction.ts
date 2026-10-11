"use server";

import { returnValidationErrors } from "next-safe-action";
import { refresh } from "next/cache";

import { transactionErrors } from "@/features/transactions/errors";
import { TransactionIdSchema } from "@/features/transactions/schemas/transaction-db-schema";
import { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import { transactionService } from "@/features/transactions/services/transaction-service";
import { authActionClient, returnActionError } from "@/lib/safe-action";

// The id is bound (`updateTransaction.bind(null, id)`), so the form reuses the create schema.
export const updateTransaction = authActionClient
  .bindArgsSchemas([TransactionIdSchema])
  .inputSchema(TransactionSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [id], ctx }) => {
    const [error, transaction] = await transactionService.update(ctx.auth.user.id, id, parsedInput);

    if (error) {
      const { title, description, ...rest } = transactionErrors[error.reason];
      if ("field" in rest) {
        returnValidationErrors(TransactionSchema, { [rest.field]: { _errors: [description] } });
      }
      return returnActionError({ reason: error.reason, message: { title, description } });
    }

    // Re-renders the current page so the table and totals show the new values.
    refresh();

    const typeLabel = transaction.type === "expense" ? "gasto" : "ingreso";

    return {
      message: {
        title: "Movimiento actualizado",
        description: `Tu ${typeLabel} «${transaction.concept}» se actualizó.`,
      },
      payload: transaction,
    };
  });
