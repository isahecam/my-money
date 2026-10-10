import { useForm } from "@formisch/react";
import type { DeepPartial } from "@formisch/react";
import { format } from "date-fns";
import { useState } from "react";
import type * as v from "valibot";

import { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";

type FinancialTransactionInput = DeepPartial<v.InferInput<typeof TransactionSchema>>;

export function useCreateTransaction(initialInput?: FinancialTransactionInput) {
  const [today] = useState(() => format(new Date(), "yyyy-MM-dd"));

  return useForm({
    schema: TransactionSchema,
    initialInput: initialInput ?? { type: "expense", transactionDate: today },
  });
}
