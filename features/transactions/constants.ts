import {
  ArrowLeftRightIcon,
  BanknoteIcon,
  CreditCardIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletCardsIcon,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps } from "react";

import type { Badge } from "@/components/ui/badge";

export const TRANSACTION_TYPES = ["income", "expense"] as const;

export const PAYMENT_METHODS = ["cash", "debit_card", "credit_card", "transfer"] as const;

export const EXPENSE_TYPES = ["fixed", "variable", "ant"] as const;

export const CURRENCIES = ["MXN"] as const;

export const TRANSACTION_TYPE_LABELS = {
  income: "Ingreso",
  expense: "Gasto",
} satisfies Record<(typeof TRANSACTION_TYPES)[number], string>;

export const TRANSACTION_TYPE_ICONS = {
  income: TrendingUpIcon,
  expense: TrendingDownIcon,
} satisfies Record<(typeof TRANSACTION_TYPES)[number], LucideIcon>;

export const TRANSACTION_TYPE_BADGE_VARIANTS = {
  income: "success",
  expense: "destructive",
} satisfies Record<(typeof TRANSACTION_TYPES)[number], ComponentProps<typeof Badge>["variant"]>;

export const PAYMENT_METHOD_LABELS = {
  cash: "Efectivo",
  debit_card: "Tarjeta de débito",
  credit_card: "Tarjeta de crédito",
  transfer: "Transferencia",
} satisfies Record<(typeof PAYMENT_METHODS)[number], string>;

export const PAYMENT_METHOD_ICONS = {
  cash: BanknoteIcon,
  debit_card: WalletCardsIcon,
  credit_card: CreditCardIcon,
  transfer: ArrowLeftRightIcon,
} satisfies Record<(typeof PAYMENT_METHODS)[number], LucideIcon>;

export const EXPENSE_TYPE_LABELS = {
  fixed: "Fijo",
  variable: "Variable",
  ant: "Hormiga",
} satisfies Record<(typeof EXPENSE_TYPES)[number], string>;

export const EXPENSE_TYPE_DESCRIPTIONS = {
  fixed: "Se repite cada periodo con el mismo monto.",
  variable: "Necesario, pero el monto cambia.",
  ant: "Pequeño y frecuente, fácil de pasar por alto.",
} satisfies Record<(typeof EXPENSE_TYPES)[number], string>;
