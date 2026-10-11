import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
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
import { formatCents } from "@/utils/currency";

export const metadata: Metadata = {
  title: "Resumen · My Money",
};

// Sample data until the DB is wired up.
const budgets = [
  { category: "Comida", spentCents: 432_000, limitCents: 600_000 },
  { category: "Transporte", spentCents: 185_000, limitCents: 250_000 },
  { category: "Entretenimiento", spentCents: 140_000, limitCents: 150_000 },
  { category: "Suscripciones", spentCents: 59_900, limitCents: 80_000 },
];

export default async function DashboardPage({ searchParams }: Readonly<PageProps<"/">>) {
  await verifySession();
  const { from, to } = await searchParamsCache.parse(searchParams);
  const hasRange = resolveDateRange({ from, to }) !== null;

  return (
    <>
      <SiteHeader title="Resumen" />

      <div className="@container/main flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-end">
          <DateRangeFilter />
        </div>

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
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Transacciones recientes</CardTitle>
              <CardDescription>
                {hasRange
                  ? "Los últimos movimientos del periodo."
                  : "Los últimos movimientos de tus cuentas."}
              </CardDescription>
              <CardAction>
                <CreateTransactionDrawerDialog />
              </CardAction>
            </CardHeader>
            <CardContent>
              <TransactionsTableErrorBoundary key={`latest|${from}|${to}`}>
                <Suspense fallback={<TransactionsTableSkeleton />}>
                  <LatestTransactionsTable />
                </Suspense>
              </TransactionsTableErrorBoundary>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Presupuestos</CardTitle>
              <CardDescription>Gasto de octubre por categoría.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                {budgets.map((budget) => (
                  <div key={budget.category} className="flex flex-col gap-2">
                    <Progress
                      locale="es-MX"
                      value={Math.round((budget.spentCents / budget.limitCents) * 100)}>
                      <ProgressLabel>{budget.category}</ProgressLabel>
                      <ProgressValue />
                    </Progress>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatCents(budget.spentCents)} de {formatCents(budget.limitCents)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
