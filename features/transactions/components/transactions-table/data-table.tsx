"use client";

import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFilters } from "@/features/transactions/hooks/use-filters";
import { cn } from "@/lib/utils";

import { features, type DataTableFeatures } from "./data-table-features";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<
  TData extends RowData & { id: string },
> extends React.ComponentProps<"div"> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  /** `page` and `pageSize` as normalized by the service, which may differ from the URL. */
  pagination: { page: number; pageSize: number; total: number };
}

export function DataTable<TData extends RowData & { id: string }>({
  columns,
  data,
  pagination: { page, pageSize, total },
  className,
  ...props
}: Readonly<DataTableProps<TData>>) {
  const [, setFilters] = useFilters({ history: "push" });
  const pagination = { pageIndex: page - 1, pageSize };

  const table = useTable({
    features,
    data,
    columns,
    getRowId: (row) => row.id,
    // `data` is already the requested page; Table must not slice it.
    manualPagination: true,
    rowCount: total,
    state: { pagination },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      setFilters({ page: next.pageIndex + 1, pageSize: next.pageSize });
    },
  });

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {/* `getVisibleCells` needs `columnVisibilityFeature`, which isn't registered. */}
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
