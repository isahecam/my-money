import { StatCard } from "@/components/layouts/stat-card";
import { resolveDateRange, searchParamsCache } from "@/features/dashboard/lib/search-params";
import { getBalance } from "@/features/dashboard/queries/get-balance";

export async function BalanceCard() {
  const range = resolveDateRange(searchParamsCache.all());
  const balanceCents = await getBalance(range);

  return (
    <StatCard
      title={range ? "Balance" : "Balance total"}
      amountCents={balanceCents}
      range={range}
    />
  );
}
