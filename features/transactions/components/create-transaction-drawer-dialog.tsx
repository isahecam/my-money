"use client";

import { Form } from "@formisch/react";
import { PlusIcon } from "lucide-react";
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
import { useCreateTransaction } from "@/features/transactions/hooks/use-create-transaction";
import { useIsMobile } from "@/hooks/use-mobile";

const TITLE = "Nuevo movimiento";
const DESCRIPTION = "Registra un ingreso o un gasto.";

export function CreateTransactionDrawerDialog() {
  const formId = useId();
  const isMobile = useIsMobile();

  const { form, open, setOpen, handleSubmit, isPending } = useCreateTransaction();

  const trigger = <Button size="sm" className="w-full sm:w-fit sm:self-end" />;
  const triggerContent = (
    <>
      <PlusIcon data-icon="inline-start" />
      {TITLE}
    </>
  );

  const formContent = (
    <Form of={form} id={formId} onSubmit={handleSubmit}>
      <TransactionForm of={form} />
    </Form>
  );

  const submitButton = (
    <Button type="submit" form={formId} disabled={isPending}>
      {isPending && <Spinner data-icon="inline-start" />}
      Guardar
    </Button>
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
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
      onOpenChange={setOpen}
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
