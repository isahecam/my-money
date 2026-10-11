import { StatCard } from "@/components/layouts/stat-card";
import { resolveDateRange, searchParamsCache } from "@/features/dashboard/lib/search-params";
import { getTotalIncome } from "@/features/dashboard/queries/get-total-income";

export async function IncomeCard() {
  const range = resolveDateRange(searchParamsCache.all());
  const totalCents = await getTotalIncome(range);

  return (
    <StatCard
      title={range ? "Ingresos" : "Ingresos totales"}
      amountCents={totalCents}
      range={range}
    />
  );
}
