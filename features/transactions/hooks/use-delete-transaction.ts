import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

import { toast } from "@/components/ui/toast";
import { deleteTransaction } from "@/features/transactions/actions/delete-transaction";
import { TransactionDto } from "@/features/transactions/types";

export function useDeleteTransaction(id: TransactionDto["id"]) {
  const [open, setOpen] = useState(false);

  const { execute, isPending } = useAction(deleteTransaction, {
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
      // No form to map onto: every message goes to the toast.
      toast.add({
        type: "error",
        title: "No se pudo eliminar el movimiento",
        description: [...formErrors, ...(fieldErrors.id ?? [])].join(" "),
      });
    },
  });

  const handleDelete = () => execute({ id });

  return { open, setOpen, handleDelete, isPending };
}
