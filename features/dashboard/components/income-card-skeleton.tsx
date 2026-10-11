import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors `IncomeCard` so the layout doesn't jump while it loads.
export function IncomeCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>
          <Skeleton className="h-4 w-24" />
        </CardDescription>
        <CardTitle>
          <Skeleton className="h-8 w-36" />
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-4 w-28" />
      </CardFooter>
    </Card>
  );
}
