import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { verifySession } from "@/features/auth/dal";
import { BalanceCard } from "@/features/dashboard/components/balance-card";
import { DateRangeFilter } from "@/features/dashboard/components/date-range-filter";
import { ExpenseCard } from "@/features/dashboard/components/expense-card";
import { IncomeCard } from "@/features/dashboard/components/income-card";
import { StatCardErrorBoundary } from "@/features/dashboard/components/stat-card-error-boundary";
import { StatCardSkeleton } from "@/features/dashboard/components/stat-card-skeleton";
import { resolveDateRange, searchParamsCache } from "@/features/dashboard/lib/search-params";
import { CreateTransactionDrawerDialog } from "@/features/transactions/components/create-transaction-drawer-dialog";
import { LatestTransactionsTable } from "@/features/transactions/components/latest-transactions-table/latest-transactions-table";
import { TransactionsTableErrorBoundary } from "@/features/transactions/components/transactions-table-error-boundary";
import { TransactionsTableSkeleton } from "@/features/transactions/components/transactions-table-skeleton";

export const metadata: Metadata = {
  title: "Resumen · My Money",
};

export default async function DashboardPage({ searchParams }: Readonly<PageProps<"/">>) {
  await verifySession();
  const { from, to } = await searchParamsCache.parse(searchParams);
  const hasRange = resolveDateRange({ from, to }) !== null;

  return (
    <>
      <SiteHeader title="Resumen" />

      <section className="@container/main flex flex-1 flex-col gap-6 p-4 pt-0">
        <Field orientation="horizontal" className="flex-wrap sm:justify-end">
          <CreateTransactionDrawerDialog />
          <DateRangeFilter />
        </Field>

        <div className="grid gap-4 @3xl/main:grid-cols-3">
          <StatCardErrorBoundary
            key={`balance|${from}|${to}`}
            title={hasRange ? "Balance" : "Balance total"}>
            <Suspense fallback={<StatCardSkeleton />}>
              <BalanceCard />
            </Suspense>
          </StatCardErrorBoundary>

          <StatCardErrorBoundary
            key={`income|${from}|${to}`}
            title={hasRange ? "Ingresos" : "Ingresos totales"}>
            <Suspense fallback={<StatCardSkeleton />}>
              <IncomeCard />
            </Suspense>
          </StatCardErrorBoundary>

          <StatCardErrorBoundary
            key={`expenses|${from}|${to}`}
            title={hasRange ? "Gastos" : "Gastos totales"}>
            <Suspense fallback={<StatCardSkeleton />}>
              <ExpenseCard />
            </Suspense>
          </StatCardErrorBoundary>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Transacciones recientes</CardTitle>
              <CardDescription>
                {hasRange
                  ? "Los últimos movimientos del periodo."
                  : "Los últimos movimientos de tus cuentas."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTableErrorBoundary key={`latest|${from}|${to}`}>
                <Suspense fallback={<TransactionsTableSkeleton />}>
                  <LatestTransactionsTable />
                </Suspense>
              </TransactionsTableErrorBoundary>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
