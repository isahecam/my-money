import { verifySession } from "@/features/auth/dal";
import { statisticsService } from "@/features/dashboard/services/statistics-service";
import type { DateRange } from "@/features/dashboard/types";

/** Total income of the signed-in user in cents, within `range` or all time when `null`. */
export async function getTotalIncome(range: DateRange | null) {
  const { user } = await verifySession();
  return statisticsService.getTotalIncome(user.id, range);
}
