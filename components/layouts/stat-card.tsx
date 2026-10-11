import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCents } from "@/utils/currency";
import { formatDateRange } from "@/utils/date";

/** Card with an amount in cents and the period it covers (`range: null` means all time). */
export function StatCard({
  title,
  amountCents,
  range,
}: Readonly<{
  title: string;
  amountCents: number;
  range: Parameters<typeof formatDateRange>[0] | null;
}>) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle>
          <span className="text-2xl tabular-nums">{formatCents(amountCents)}</span>
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
