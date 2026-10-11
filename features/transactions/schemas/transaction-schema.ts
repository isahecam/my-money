import * as v from "valibot";

import { EXPENSE_TYPES, PAYMENT_METHODS } from "@/features/transactions/constants";

// Ordered as in the form: Formisch focuses the first invalid field by schema order.
const sharedEntries = {
  concept: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Ingresa el concepto."),
    v.maxLength(100, "El concepto debe tener como máximo 100 caracteres."),
  ),
  // Pesos as a string; the service converts it to cents. No transform here: the action
  // re-parses the form output with this same schema.
  amount: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Ingresa el monto."),
    v.regex(/^\d{1,10}(\.\d{1,2})?$/, "Ingresa un monto válido, con hasta 2 decimales."),
    v.check((amount) => Number(amount) > 0, "El monto debe ser mayor a 0."),
  ),
  paymentMethod: v.picklist(PAYMENT_METHODS, "Selecciona el método de pago."),
  transactionDate: v.pipe(
    v.string(),
    v.nonEmpty("Selecciona la fecha."),
    v.isoDate("Selecciona una fecha válida."),
  ),
  notes: v.optional(
    v.pipe(
      v.string(),
      v.trim(),
      v.maxLength(500, "Las notas deben tener como máximo 500 caracteres."),
    ),
  ),
};

// `abortPipeEarly`: one message per field instead of every failed action.
export const TransactionSchema = v.config(
  v.variant("type", [
    v.object({
      type: v.literal("expense"),
      expenseType: v.picklist(EXPENSE_TYPES, "Selecciona el tipo de gasto."),
      ...sharedEntries,
    }),
    v.object({
      type: v.literal("income"),
      ...sharedEntries,
    }),
  ]),
  { abortPipeEarly: true },
);
