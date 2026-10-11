import type { TransactionDto } from "@/features/transactions/types";
import { cn } from "@/lib/utils";
import { formatCents } from "@/utils/currency";

/**
 * Positive amount in cents shown with the sign and color of its type: "+" in green for income,
 * "-" in red for expenses. Amounts are stored positive, so the sign comes from `type`.
 */
export function TransactionAmount({
  type,
  amountCents,
  className,
  ...props
}: Readonly<
  React.ComponentProps<"span"> & {
    type: TransactionDto["type"];
    amountCents: number;
  }
>) {
  const isExpense = type === "expense";

  return (
    <span className={cn(isExpense ? "text-destructive" : "text-success", className)} {...props}>
      {isExpense ? "-" : "+"} {formatCents(amountCents)}
    </span>
  );
}
