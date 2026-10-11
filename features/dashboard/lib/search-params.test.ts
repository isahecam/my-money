import { describe, expect, test } from "vitest";

import { parseAsDateString, resolveDateRange } from "@/features/dashboard/lib/search-params";

describe("parseAsDateString", () => {
  test("keeps a valid date as a string", () => {
    expect(parseAsDateString.parse("2026-10-01")).toBe("2026-10-01");
  });

  test.each(["2026-02-30", "2026-13-01", "2026-1-5", "basura", ""])("rejects %j", (value) => {
    expect(parseAsDateString.parse(value)).toBeNull();
  });

  test("serializes the string as is", () => {
    expect(parseAsDateString.serialize("2026-10-01")).toBe("2026-10-01");
  });
});

describe("resolveDateRange", () => {
  test("returns a complete range", () => {
    expect(resolveDateRange({ from: "2026-10-01", to: "2026-10-31" })).toEqual({
      from: "2026-10-01",
      to: "2026-10-31",
    });
  });

  test("accepts a one-day range", () => {
    expect(resolveDateRange({ from: "2026-10-01", to: "2026-10-01" })).not.toBeNull();
  });

  test.each([
    { from: "2026-10-01", to: null },
    { from: null, to: "2026-10-31" },
    { from: null, to: null },
  ])("returns null for an incomplete range %j", (range) => {
    expect(resolveDateRange(range)).toBeNull();
  });

  test("returns null when from is after to", () => {
    expect(resolveDateRange({ from: "2026-10-31", to: "2026-10-01" })).toBeNull();
  });
});
