import { describe, expect, test } from "vitest";

import { formatCents } from "@/utils/currency";

// Intl separates the code from the amount with a non-breaking space.
describe("formatCents", () => {
  test.each([
    [1_600_000, "MXN 16,000.00"],
    [4_550, "MXN 45.50"],
    [0, "MXN 0.00"],
    [-124_530, "-MXN 1,245.30"],
  ])("formats %i cents as %j", (cents, expected) => {
    expect(formatCents(cents)).toBe(expected);
  });
});
