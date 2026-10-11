import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveDateRange, searchParamsCache } from "@/features/dashboard/lib/search-params";
import { getTotalIncome } from "@/features/dashboard/queries/get-total-income";
import { formatDateRange } from "@/utils/date";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "code",
});

export async function IncomeCard() {
  const range = resolveDateRange(searchParamsCache.all());
  const totalCents = await getTotalIncome(range);

  return (
    <Card>
      <CardHeader>
        <CardDescription>{range ? "Ingresos" : "Ingresos totales"}</CardDescription>
        <CardTitle>
          <span className="text-2xl tabular-nums">{currency.format(totalCents / 100)}</span>
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
