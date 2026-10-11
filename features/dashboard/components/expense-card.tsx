import { StatCard } from "@/components/layouts/stat-card";
import { resolveDateRange, searchParamsCache } from "@/features/dashboard/lib/search-params";
import { getTotalExpenses } from "@/features/dashboard/queries/get-total-expenses";

export async function ExpenseCard() {
  const range = resolveDateRange(searchParamsCache.all());
  const totalCents = await getTotalExpenses(range);

  return (
    <StatCard title={range ? "Gastos" : "Gastos totales"} amountCents={totalCents} range={range} />
  );
}
