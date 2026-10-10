"use client";

import { Form, reset } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
import { PlusIcon } from "lucide-react";
import { useId, useState } from "react";

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
import { toast } from "@/components/ui/toast";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useCreateTransaction } from "@/features/transactions/hooks/use-create-transaction";
import { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import { useIsMobile } from "@/hooks/use-mobile";

const TITLE = "Nuevo movimiento";
const DESCRIPTION = "Registra un ingreso o un gasto.";

export function CreateTransactionDrawerDialog() {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const { ...form } = useCreateTransaction();

  // TODO: replace with the create Server Action.
  const handleSubmit: SubmitHandler<typeof TransactionSchema> = (e) => {
    console.log("Submitted:", e);
    toast.add({ type: "success", title: "Movimiento registrado." });
    setOpen(false);
    reset(form);
  };

  const trigger = <Button size="sm" />;
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
    <Button type="submit" form={formId} disabled={form.isSubmitting}>
      {form.isSubmitting && <Spinner data-icon="inline-start" />}
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
          <div className="-mx-6 min-h-0 flex-1 overflow-y-auto px-6">{formContent}</div>
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
        <div className="flex-1 overflow-y-auto p-4">{formContent}</div>
        <DrawerFooter>
          {submitButton}
          <DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
