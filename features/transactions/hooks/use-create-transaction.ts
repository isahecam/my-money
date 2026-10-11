import { reset, useForm } from "@formisch/react";
import type { DeepPartial, SubmitHandler } from "@formisch/react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import type * as v from "valibot";

import { toast } from "@/components/ui/toast";
import { createTransaction } from "@/features/transactions/actions/create-transaction";
import { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import { dt } from "@/lib/date";
import { mapToFormischErrors } from "@/lib/form-errors";

type TransactionInput = DeepPartial<v.InferInput<typeof TransactionSchema>>;

export function useCreateTransaction(initialInput?: TransactionInput) {
  const [today] = useState(() => dt.today());
  const [open, setOpen] = useState(false);

  const form = useForm({
    schema: TransactionSchema,
    initialInput: initialInput ?? { type: "expense", transactionDate: today },
  });

  const { execute, isPending } = useAction(createTransaction, {
    onSuccess: ({ data }) => {
      toast.add({ type: "success", ...data.message });
      setOpen(false);
      reset(form);
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
          title: "No se pudo registrar el movimiento",
          description: formErrors.join(" "),
        });
      }
    },
  });

  // Not `executeAsync`: it throws on the `/sign-in` redirect and Formisch would show it as a form error.
  const handleSubmit: SubmitHandler<typeof TransactionSchema> = (data) => {
    execute(data);
  };

  return { form, open, setOpen, handleSubmit, isPending };
}
