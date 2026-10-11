import { resolveDateRange, searchParamsCache } from "@/features/dashboard/lib/search-params";
import { getLatestTransactions } from "@/features/transactions/queries/get-latest-transactions";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export async function LatestTransactionsTable() {
  const range = resolveDateRange(searchParamsCache.all());
  const transactions = await getLatestTransactions(range);

  return <DataTable columns={columns} data={transactions} />;
}
