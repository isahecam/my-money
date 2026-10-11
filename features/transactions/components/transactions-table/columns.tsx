"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DeleteTransactionDialog } from "@/features/transactions/components/delete-transaction-dialog";
import { TransactionAmount } from "@/features/transactions/components/transaction-amount";
import {
  EXPENSE_TYPE_LABELS,
  PAYMENT_METHOD_ICONS,
  PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_BADGE_VARIANTS,
  TRANSACTION_TYPE_ICONS,
  TRANSACTION_TYPE_LABELS,
} from "@/features/transactions/constants";
import type { TransactionDto } from "@/features/transactions/types";
import { dt } from "@/lib/date";

import type { DataTableFeatures } from "./data-table-features";

const columnHelper = createColumnHelper<DataTableFeatures, TransactionDto>();

export const columns = columnHelper.columns([
  columnHelper.accessor("transactionDate", {
    header: "Fecha",
    // Full history spans years, unlike the dashboard's latest transactions.
    cell: (info) => dt.format(info.getValue(), "d MMM yyyy"),
  }),
  columnHelper.accessor("concept", {
    header: "Concepto",
  }),
  columnHelper.accessor("type", {
    header: "Tipo",
    cell: (info) => {
      const type = info.getValue();
      const Icon = TRANSACTION_TYPE_ICONS[type];
      return (
        <Badge variant={TRANSACTION_TYPE_BADGE_VARIANTS[type]}>
          <Icon data-icon="inline-start" />
          {TRANSACTION_TYPE_LABELS[type]}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("paymentMethod", {
    header: "Método de pago",
    cell: (info) => {
      const paymentMethod = info.getValue();
      const Icon = PAYMENT_METHOD_ICONS[paymentMethod];
      return (
        <Badge variant="outline">
          <Icon data-icon="inline-start" />
          {PAYMENT_METHOD_LABELS[paymentMethod]}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("expenseType", {
    header: "Tipo de gasto",
    cell: (info) => {
      const expenseType = info.getValue();
      return expenseType ? EXPENSE_TYPE_LABELS[expenseType] : "—";
    },
  }),
  columnHelper.accessor("amountCents", {
    header: "Monto",
    cell: (info) => (
      <TransactionAmount
        type={info.row.original.type}
        amountCents={info.getValue()}
        className="font-bold"
      />
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-center gap-3">
        <DeleteTransactionDialog transaction={row.original} />
      </div>
    ),
  }),
]);
