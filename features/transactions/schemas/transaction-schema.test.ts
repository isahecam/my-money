import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { TransactionSchema } from "./transaction-schema";

const expense = {
  type: "expense",
  expenseType: "ant",
  concept: "Café",
  amount: "45.50",
  paymentMethod: "debit_card",
  transactionDate: "2026-10-09",
};

const income = {
  type: "income",
  concept: "Nómina",
  amount: "16000",
  paymentMethod: "transfer",
  transactionDate: "2026-10-01",
};

function issuePaths(input: unknown) {
  const result = v.safeParse(TransactionSchema, input);
  return result.issues?.map((issue) => v.getDotPath(issue));
}

describe("TransactionSchema", () => {
  it("accepts a valid expense", () => {
    expect(v.safeParse(TransactionSchema, expense).success).toBe(true);
  });

  it("accepts an income without expenseType", () => {
    expect(v.safeParse(TransactionSchema, income).success).toBe(true);
  });

  it("requires expenseType for an expense", () => {
    expect(issuePaths({ ...expense, expenseType: undefined })).toEqual(["expenseType"]);
  });

  it("trims concept and rejects it when blank", () => {
    expect(issuePaths({ ...expense, concept: "   " })).toEqual(["concept"]);
  });

  it.each(["", "0", "0.00", "-5", "1.234", "abc", "12345678901"])("rejects amount %s", (amount) => {
    expect(issuePaths({ ...expense, amount })).toEqual(["amount"]);
  });

  it.each(["0.01", "150.5", "9999999999.99"])("accepts amount %s", (amount) => {
    expect(v.safeParse(TransactionSchema, { ...expense, amount }).success).toBe(true);
  });

  it.each(["", "2026-13-01", "09/10/2026"])("rejects date %j", (transactionDate) => {
    expect(issuePaths({ ...expense, transactionDate })).toEqual(["transactionDate"]);
  });

  it("rejects notes over 500 characters", () => {
    expect(issuePaths({ ...expense, notes: "a".repeat(501) })).toEqual(["notes"]);
  });
});
