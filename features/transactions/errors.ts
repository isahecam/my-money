import type * as v from "valibot";

import type { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";

/** Business errors. Those with `field` are shown on that form field. */
export const transactionErrors = {
  TRANSACTION_AMOUNT_NOT_POSITIVE: {
    title: "Monto inválido",
    description: "El monto debe ser mayor a 0.",
    field: "amount",
  },
  TRANSACTION_USER_NOT_FOUND: {
    title: "No se pudo registrar el movimiento",
    description: "Tu usuario ya no existe.",
  },
} as const satisfies Record<
  string,
  { title: string; description: string; field?: keyof v.InferInput<typeof TransactionSchema> }
>;

export const transactionConstraints = {
  transactions_amount_positive: "TRANSACTION_AMOUNT_NOT_POSITIVE",
  transactions_user_id_users_id_fk: "TRANSACTION_USER_NOT_FOUND",
} as const satisfies Record<string, keyof typeof transactionErrors>;
