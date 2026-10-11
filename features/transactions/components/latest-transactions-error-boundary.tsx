"use client";

import { AlertCircleIcon } from "lucide-react";
import { catchError, type ErrorInfo } from "next/error";

import { Button } from "@/components/ui/button";

// Isolates a failing table so it doesn't bubble up to the page's error.tsx.
// `error.message` isn't shown: in production Next replaces it with a generic message and digest.
function LatestTransactionsErrorFallback(_props: object, { retry }: ErrorInfo) {
  return (
    <div className="flex h-24 items-center justify-between gap-4 px-4">
      <div className="inline-flex items-center gap-1.5 text-sm text-destructive">
        <AlertCircleIcon className="size-4" />
        <span>No se pudieron cargar los movimientos.</span>
      </div>
      <Button variant="outline" size="sm" onClick={() => retry()}>
        Reintentar
      </Button>
    </div>
  );
}

/** @see https://nextjs.org/docs/app/api-reference/functions/catchError */
export const LatestTransactionsErrorBoundary = catchError(LatestTransactionsErrorFallback);
