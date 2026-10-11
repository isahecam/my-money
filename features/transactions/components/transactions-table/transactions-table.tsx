import { searchParamsCache } from "@/features/transactions/lib/search-params";
import { getTransactions } from "@/features/transactions/queries/get-transactions";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export async function TransactionsTable() {
  const { data, ...pagination } = await getTransactions(searchParamsCache.all());

  return <DataTable columns={columns} data={data} pagination={pagination} />;
}
