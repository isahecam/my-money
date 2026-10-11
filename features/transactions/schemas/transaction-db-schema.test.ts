import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { DeleteTransactionSchema } from "./transaction-db-schema";

describe("DeleteTransactionSchema", () => {
  it("accepts the id as the `uuid` column stores it", () => {
    const input = { id: "0b5e1d36-8a3f-4c2e-9d61-2f7a4b8c9e10" };
    expect(v.parse(DeleteTransactionSchema, input)).toEqual(input);
  });

  it("rejects an id that isn't a uuid, with its own message", () => {
    const result = v.safeParse(DeleteTransactionSchema, { id: "123" });
    expect(result.issues?.map((issue) => issue.message)).toEqual(["Movimiento inválido."]);
  });

  it("keeps only the id", () => {
    const input = { id: "0b5e1d36-8a3f-4c2e-9d61-2f7a4b8c9e10", userId: "someone-else" };
    expect(v.parse(DeleteTransactionSchema, input)).toEqual({ id: input.id });
  });
});
