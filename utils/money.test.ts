import { describe, expect, test } from "vitest";

import { fromCents, toCents } from "@/utils/money";

describe("toCents", () => {
  test.each([
    ["0.01", 1],
    ["150.5", 15_050],
    ["45.50", 4_550],
    ["16000", 1_600_000],
    ["9999999999.99", 999_999_999_999],
  ])("converts %s to %i cents", (amount, cents) => {
    expect(toCents(amount)).toBe(cents);
  });
});

describe("fromCents", () => {
  test.each([
    [1, "0.01"],
    [15_050, "150.50"],
    [4_505, "45.05"],
    [1_600_000, "16000"],
    [999_999_999_999, "9999999999.99"],
  ])("converts %i cents to %s", (cents, amount) => {
    expect(fromCents(cents)).toBe(amount);
  });

  test.each([1, 15_050, 1_600_000, 999_999_999_999])("round-trips %i through toCents", (cents) => {
    expect(toCents(fromCents(cents))).toBe(cents);
  });
});
