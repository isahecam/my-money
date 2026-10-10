import { describe, expect, test } from "vitest";

import { getInitials } from "@/utils/string";

describe("getInitials", () => {
  test("uses the first letter of the first two words", () => {
    expect(getInitials("Ana María López")).toBe("AM");
  });

  test("uppercases the initials", () => {
    expect(getInitials("ana lópez")).toBe("AL");
  });

  test("returns one initial for a single word", () => {
    expect(getInitials("Ana")).toBe("A");
  });
});
