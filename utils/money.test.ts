import { describe, expect, test } from "vitest";

import { toCents } from "@/utils/money";

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
