import { reset, useForm } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

import { toast } from "@/components/ui/toast";
import { updateTransaction } from "@/features/transactions/actions/update-transaction";
import { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import type { TransactionDto } from "@/features/transactions/types";
import { mapToFormischErrors } from "@/lib/form-errors";
import { fromCents } from "@/utils/money";

export function useUpdateTransaction(transaction: TransactionDto) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    schema: TransactionSchema,
    initialInput: {
      type: transaction.type,
      expenseType: transaction.expenseType ?? undefined,
      concept: transaction.concept,
      amount: fromCents(transaction.amountCents),
      paymentMethod: transaction.paymentMethod,
      transactionDate: transaction.transactionDate,
      notes: transaction.notes ?? undefined,
    },
  });

  const { execute, isPending } = useAction(updateTransaction.bind(null, transaction.id), {
    onSuccess: ({ data }) => {
      toast.add({ type: "success", ...data.message });
      setOpen(false);
    },
    // Only one of `serverError` / `validationErrors` is ever set.
    onError: ({ error: { serverError, validationErrors } }) => {
      if (serverError) {
        toast.add({ type: "error", ...serverError.message });
        return;
      }
      if (!validationErrors) return;

      const { formErrors, fieldErrors } = validationErrors;
      mapToFormischErrors(form, fieldErrors);
      if (formErrors.length) {
        toast.add({
          type: "error",
          title: "No se pudo actualizar el movimiento",
          description: formErrors.join(" "),
        });
      }
    },
  });

  // `useForm` reads `initialInput` only on mount (unlike React Hook Form's `values`). Formisch's
  // docs use `reset` with a new `initialInput` when server data changes: on open it loads the
  // latest saved values and drops edits from a cancelled attempt.
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen)
      reset(form, {
        initialInput: {
          type: transaction.type,
          expenseType: transaction.expenseType ?? undefined,
          concept: transaction.concept,
          amount: fromCents(transaction.amountCents),
          paymentMethod: transaction.paymentMethod,
          transactionDate: transaction.transactionDate,
          notes: transaction.notes ?? undefined,
        },
      });
    setOpen(nextOpen);
  }

  // Not `executeAsync`: it throws on the `/sign-in` redirect and Formisch would show it as a form error.
  const handleSubmit: SubmitHandler<typeof TransactionSchema> = (data) => {
    execute(data);
  };

  return { form, open, handleOpenChange, handleSubmit, isPending };
}
