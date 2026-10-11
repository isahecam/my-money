import { verifySession } from "@/features/auth/dal";
import { statisticsService } from "@/features/dashboard/services/statistics-service";
import type { DateRange } from "@/features/dashboard/types";

/** Total expenses of the signed-in user in cents, within `range` or all time when `null`. */
export async function getTotalExpenses(range: DateRange | null) {
  const { user } = await verifySession();
  return statisticsService.getTotalExpenses(user.id, range);
}
