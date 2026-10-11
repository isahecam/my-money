"use client";

import type { ReactTable, RowData } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field";

import type { DataTableFeatures } from "./data-table-features";

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function DataTablePagination<TData extends RowData>({
  table,
}: Readonly<DataTablePaginationProps<TData>>) {
  const { pageIndex } = table.state.pagination;
  // An empty table still reads "Página 1 de 1".
  const pageCount = Math.max(table.getPageCount(), 1);
  const rowCount = table.getRowCount();

  return (
    <FieldGroup className="flex-row">
      <Field orientation="responsive">
        <FieldContent>
          <FieldTitle>
            <span className="tabular-nums">
              {rowCount} {rowCount === 1 ? "movimiento" : "movimientos"}
            </span>
          </FieldTitle>
          <FieldDescription>
            Página <span className="tabular-nums">{pageIndex + 1}</span> de{" "}
            <span className="tabular-nums">{pageCount}</span>
          </FieldDescription>
        </FieldContent>

        <Button
          variant="outline"
          aria-label="Primera página"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.firstPage()}>
          <ChevronsLeftIcon />
        </Button>

        <Button
          variant="outline"
          aria-label="Página anterior"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}>
          <ChevronLeftIcon />
        </Button>

        <Button
          variant="outline"
          aria-label="Página siguiente"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}>
          <ChevronRightIcon />
        </Button>

        <Button
          variant="outline"
          aria-label="Última página"
          disabled={!table.getCanLastPage()}
          onClick={() => table.lastPage()}>
          <ChevronsRightIcon />
        </Button>
      </Field>
    </FieldGroup>
  );
}
