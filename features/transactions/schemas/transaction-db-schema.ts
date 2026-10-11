// Server only: it imports the Drizzle table, so a Client Component must never import it.
import { createSelectSchema } from "drizzle-valibot";
import * as v from "valibot";

import { transactions } from "@/db/schema";

// Each field validates as its column's type (`id` is `uuid` today), so a column change carries over.
const transactionRow = createSelectSchema(transactions, {
  // Refinement: keeps the generated validation and only replaces its message.
  id: (schema) => v.message(schema, "Movimiento inválido."),
});

/** Id bound to an action next to a form (`bindArgsSchemas`). */
export const TransactionIdSchema = transactionRow.entries.id;

export const DeleteTransactionSchema = v.pick(transactionRow, ["id"]);
