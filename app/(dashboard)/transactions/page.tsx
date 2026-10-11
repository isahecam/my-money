import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteHeader } from "@/components/site-header";
import { verifySession } from "@/features/auth/dal";
import { CreateTransactionDrawerDialog } from "@/features/transactions/components/create-transaction-drawer-dialog";
import { TransactionsTableErrorBoundary } from "@/features/transactions/components/transactions-table-error-boundary";
import { TransactionsTableSkeleton } from "@/features/transactions/components/transactions-table-skeleton";
import { TransactionsTable } from "@/features/transactions/components/transactions-table/transactions-table";
import { searchParamsCache } from "@/features/transactions/lib/search-params";

export const metadata: Metadata = {
  title: "Transacciones · My Money",
};

export default async function TransactionsPage({
  searchParams,
}: Readonly<PageProps<"/transactions">>) {
  await verifySession();
  const { page, pageSize } = await searchParamsCache.parse(searchParams);

  return (
    <>
      <SiteHeader title="Transacciones" />

      <section className="@container/main flex flex-1 flex-col gap-6 p-4 pt-0">
        <CreateTransactionDrawerDialog />

        <TransactionsTableErrorBoundary key={`transactions|${page}|${pageSize}`}>
          <Suspense fallback={<TransactionsTableSkeleton />}>
            <TransactionsTable />
          </Suspense>
        </TransactionsTableErrorBoundary>
      </section>
    </>
  );
}
