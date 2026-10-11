import { resolveDateRange, searchParamsCache } from "@/features/dashboard/lib/search-params";
import { getLatestTransactions } from "@/features/transactions/queries/get-latest-transactions";

import { columns } from "./transactions-table/columns";
import { DataTable } from "./transactions-table/data-table";

export async function LatestTransactionsTable() {
  const range = resolveDateRange(searchParamsCache.all());
  const transactions = await getLatestTransactions(range);

  return <DataTable columns={columns} data={transactions} />;
}
