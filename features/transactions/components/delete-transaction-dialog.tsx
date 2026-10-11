"use client";

import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteTransaction } from "@/features/transactions/hooks/use-delete-transaction";
import type { TransactionDto } from "@/features/transactions/types";

export function DeleteTransactionDialog({
  transaction,
}: Readonly<{ transaction: Pick<TransactionDto, "id" | "concept"> }>) {
  const { open, setOpen, handleDelete, isPending } = useDeleteTransaction(transaction.id);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon-sm"
            aria-label={`Eliminar «${transaction.concept}»`}
          />
        }>
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar movimiento?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará «{transaction.concept}» de forma permanente. Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {/* Not a close button: the dialog closes on success, so errors keep it open. */}
          <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleDelete}>
            {isPending && <Spinner data-icon="inline-start" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
