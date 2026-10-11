"use client";

import { AlertCircleIcon } from "lucide-react";
import { catchError, type ErrorInfo } from "next/error";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Isolates a failing card so it doesn't bubble up to the page's error.tsx.
// `error.message` isn't shown: in production Next replaces it with a generic message and digest.
function StatCardErrorFallback({ title }: { title: string }, { retry }: ErrorInfo) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle>
          <span className="text-2xl text-muted-foreground">—</span>
        </CardTitle>
      </CardHeader>
      <CardFooter className="justify-between">
        <div className="inline-flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircleIcon className="size-4" />
          <span>No se pudo cargar el dato.</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => retry()}>
          Reintentar
        </Button>
      </CardFooter>
    </Card>
  );
}

/** @see https://nextjs.org/docs/app/api-reference/functions/catchError */
export const StatCardErrorBoundary = catchError(StatCardErrorFallback);
