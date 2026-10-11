import { describe, expect, test } from "vitest";

import { formatDateRange } from "@/utils/date";

describe("formatDateRange", () => {
  test("formats both ends in Spanish with the year at the end", () => {
    expect(formatDateRange({ from: "2026-10-01", to: "2026-10-31" })).toBe("1 oct – 31 oct 2026");
  });

  test("keeps the exact days, without time zone shifts", () => {
    expect(formatDateRange({ from: "2026-01-01", to: "2026-12-31" })).toBe("1 ene – 31 dic 2026");
  });
});
