import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionAmount } from "@/features/transactions/components/transaction-amount";
import type { TransactionDto } from "@/features/transactions/types";
import { cn } from "@/lib/utils";
import { formatCents } from "@/utils/currency";
import { formatDateRange } from "@/utils/date";

/**
 * Card with an amount in cents and the period it covers (`range: null` means all time).
 * With `type`, the amount shows the sign and color of income or expenses.
 */
export function StatCard({
  title,
  amountCents,
  range,
  type,
  className,
  ...props
}: Readonly<
  React.ComponentProps<typeof Card> & {
    title: string;
    amountCents: number;
    range: Parameters<typeof formatDateRange>[0] | null;
    type?: TransactionDto["type"];
  }
>) {
  return (
    <Card className={cn("@container/card", className)} {...props}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle>
          {type ? (
            <TransactionAmount
              type={type}
              amountCents={amountCents}
              className="text-2xl tabular-nums"
            />
          ) : (
            <span className="text-2xl tabular-nums">{formatCents(amountCents)}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <span className="text-sm text-muted-foreground">
          {range ? formatDateRange(range) : "Todo el historial"}
        </span>
      </CardFooter>
    </Card>
  );
}
