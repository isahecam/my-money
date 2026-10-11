import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { TransactionAmount } from "@/features/transactions/components/transaction-amount";

// Intl separates the code from the amount with a non-breaking space.
describe("TransactionAmount", () => {
  test("shows income with a plus sign in green", () => {
    render(<TransactionAmount type="income" amountCents={1_600_000} />);

    const amount = screen.getByText("+ MXN 16,000.00");
    expect(amount.classList).toContain("text-success");
  });

  test("shows expenses with a minus sign in red", () => {
    render(<TransactionAmount type="expense" amountCents={124_530} />);

    const amount = screen.getByText("- MXN 1,245.30");
    expect(amount.classList).toContain("text-destructive");
  });
});
