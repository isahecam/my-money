import { Skeleton } from "@/components/ui/skeleton";

// Mirrors `DataTable` (header plus rows) so the layout doesn't jump while it loads.
export function TransactionsTableSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-3">
      <Skeleton className="h-6 w-full" />
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-8 w-full" />
      ))}
    </div>
  );
}
