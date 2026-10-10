import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import {
  EXPENSE_TYPES,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
} from "@/features/transactions/constants";

import { users } from "./auth-schema";

export const transactionType = pgEnum("transaction_type_enum", TRANSACTION_TYPES);

export const paymentMethod = pgEnum("transaction_payment_method_enum", PAYMENT_METHODS);

export const expenseType = pgEnum("transaction_expense_type_enum", EXPENSE_TYPES);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: transactionType("type").notNull(),
    concept: text("concept").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    paymentMethod: paymentMethod("payment_method").notNull(),
    expenseType: expenseType("expense_type"),
    transactionDate: date("transaction_date", { mode: "string" }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check("transactions_amount_positive", sql`${table.amount} > 0`),
    index("transactions_user_date_idx").on(table.userId, table.transactionDate),
    index("transactions_user_type_idx").on(table.userId, table.type),
    index("transactions_user_payment_method_idx").on(table.userId, table.paymentMethod),
    index("transactions_user_expense_type_idx").on(table.userId, table.expenseType),
  ],
);
