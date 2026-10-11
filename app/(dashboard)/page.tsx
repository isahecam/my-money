import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { verifySession } from "@/features/auth/dal";
import { BalanceCard } from "@/features/dashboard/components/balance-card";
import { DateRangeFilter } from "@/features/dashboard/components/date-range-filter";
import { ExpenseCard } from "@/features/dashboard/components/expense-card";
import { IncomeCard } from "@/features/dashboard/components/income-card";
import { StatCardErrorBoundary } from "@/features/dashboard/components/stat-card-error-boundary";
import { StatCardSkeleton } from "@/features/dashboard/components/stat-card-skeleton";
import { resolveDateRange, searchParamsCache } from "@/features/dashboard/lib/search-params";
import { CreateTransactionDrawerDialog } from "@/features/transactions/components/create-transaction-drawer-dialog";
import { dt } from "@/lib/date";
import { formatCents } from "@/utils/currency";

export const metadata: Metadata = {
  title: "Resumen · My Money",
};

// Sample data until the DB is wired up.
const transactions = [
  {
    id: 1,
    date: "2026-10-07",
    description: "Supermercado",
    category: "Comida",
    account: "Débito",
    amountCents: -124_530,
  },
  {
    id: 2,
    date: "2026-10-06",
    description: "Nómina",
    category: "Salario",
    account: "Débito",
    amountCents: 1_600_000,
  },
  {
    id: 3,
    date: "2026-10-05",
    description: "Netflix",
    category: "Suscripciones",
    account: "Crédito",
    amountCents: -29_900,
  },
  {
    id: 4,
    date: "2026-10-04",
    description: "Gasolina",
    category: "Transporte",
    account: "Crédito",
    amountCents: -85_000,
  },
  {
    id: 5,
    date: "2026-10-02",
    description: "Renta",
    category: "Vivienda",
    account: "Débito",
    amountCents: -950_000,
  },
];

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

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-end">
          <DateRangeFilter />
        </div>

        <div className="grid gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card md:grid-cols-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
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

          <StatCardErrorBoundary
            key={`balance|${from}|${to}`}
            title={hasRange ? "Balance" : "Balance total"}>
            <Suspense fallback={<StatCardSkeleton />}>
              <BalanceCard />
            </Suspense>
          </StatCardErrorBoundary>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Transacciones recientes</CardTitle>
              <CardDescription>Los últimos movimientos de tus cuentas.</CardDescription>
              <CardAction>
                <CreateTransactionDrawerDialog />
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead className="hidden md:table-cell">Cuenta</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <span className="text-muted-foreground">{dt.format(tx.date, "d MMM")}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{tx.description}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{tx.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{tx.account}</TableCell>
                      <TableCell className="text-right">
                        <span className="tabular-nums">
                          {tx.amountCents > 0 && "+"}
                          {formatCents(tx.amountCents)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
