"use client";

import { Form } from "@formisch/react";
import { PencilIcon } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useUpdateTransaction } from "@/features/transactions/hooks/use-update-transaction";
import type { TransactionDto } from "@/features/transactions/types";
import { useIsMobile } from "@/hooks/use-mobile";

const TITLE = "Editar movimiento";
const DESCRIPTION = "Actualiza los datos del ingreso o gasto.";

export function EditTransactionDrawerDialog({
  transaction,
}: Readonly<{ transaction: TransactionDto }>) {
  const formId = useId();
  const isMobile = useIsMobile();

  const { form, open, handleOpenChange, handleSubmit, isPending } =
    useUpdateTransaction(transaction);

  const trigger = (
    <Button variant="ghost" size="icon-sm" aria-label={`Editar «${transaction.concept}»`} />
  );
  const triggerContent = <PencilIcon />;

  const formContent = (
    <Form of={form} id={formId} onSubmit={handleSubmit}>
      <TransactionForm of={form} />
    </Form>
  );

  const submitButton = (
    <Button type="submit" form={formId} disabled={isPending}>
      {isPending && <Spinner data-icon="inline-start" />}
      Guardar cambios
    </Button>
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger render={trigger}>{triggerContent}</DialogTrigger>
        <DialogContent className="flex max-h-11/12 flex-col">
          <DialogHeader>
            <DialogTitle>{TITLE}</DialogTitle>
            <DialogDescription>{DESCRIPTION}</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 scroll-fade scrollbar-none overflow-y-auto px-6 py-3">
            {formContent}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            {submitButton}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}>
      <DrawerTrigger render={trigger}>{triggerContent}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{TITLE}</DrawerTitle>
          <DrawerDescription>{DESCRIPTION}</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 scroll-fade scrollbar-none overflow-y-auto p-4">{formContent}</div>
        <DrawerFooter>
          {submitButton}
          <DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
