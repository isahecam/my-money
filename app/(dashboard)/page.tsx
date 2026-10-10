import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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

export const metadata: Metadata = {
  title: "Resumen · My Money",
};

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const shortDate = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });

// Sample data until the DB is wired up.
const stats = [
  { label: "Saldo total", value: 84_250.4, change: 4.2, hint: "En todas tus cuentas" },
  { label: "Ingresos del mes", value: 32_000, change: 1.5, hint: "Frente al mes anterior" },
  { label: "Gastos del mes", value: 18_430.75, change: -6.8, hint: "Frente al mes anterior" },
  { label: "Ahorro del mes", value: 13_569.25, change: 12.3, hint: "42 % de tus ingresos" },
];

const transactions = [
  {
    id: 1,
    date: "2026-10-07",
    description: "Supermercado",
    category: "Comida",
    account: "Débito",
    amount: -1_245.3,
  },
  {
    id: 2,
    date: "2026-10-06",
    description: "Nómina",
    category: "Salario",
    account: "Débito",
    amount: 16_000,
  },
  {
    id: 3,
    date: "2026-10-05",
    description: "Netflix",
    category: "Suscripciones",
    account: "Crédito",
    amount: -299,
  },
  {
    id: 4,
    date: "2026-10-04",
    description: "Gasolina",
    category: "Transporte",
    account: "Crédito",
    amount: -850,
  },
  {
    id: 5,
    date: "2026-10-02",
    description: "Renta",
    category: "Vivienda",
    account: "Débito",
    amount: -9_500,
  },
];

const budgets = [
  { category: "Comida", spent: 4_320, limit: 6_000 },
  { category: "Transporte", spent: 1_850, limit: 2_500 },
  { category: "Entretenimiento", spent: 1_400, limit: 1_500 },
  { category: "Suscripciones", spent: 599, limit: 800 },
];

export default async function DashboardPage() {
  await verifySession();

  return (
    <>
      <SiteHeader title="Resumen" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const TrendIcon = stat.change >= 0 ? TrendingUpIcon : TrendingDownIcon;
            return (
              <Card key={stat.label}>
                <CardHeader>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle>
                    <span className="text-2xl tabular-nums">{currency.format(stat.value)}</span>
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <TrendIcon data-icon="inline-start" />
                      {stat.change > 0 && "+"}
                      {stat.change} %
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter>
                  <span className="text-sm text-muted-foreground">{stat.hint}</span>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Transacciones recientes</CardTitle>
              <CardDescription>Los últimos movimientos de tus cuentas.</CardDescription>
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
                        <span className="text-muted-foreground">
                          {shortDate.format(new Date(`${tx.date}T00:00:00`))}
                        </span>
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
                          {tx.amount > 0 && "+"}
                          {currency.format(tx.amount)}
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
                      value={Math.round((budget.spent / budget.limit) * 100)}>
                      <ProgressLabel>{budget.category}</ProgressLabel>
                      <ProgressValue />
                    </Progress>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {currency.format(budget.spent)} de {currency.format(budget.limit)}
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
