import { verifySession } from "@/features/auth/dal";
import { statisticsService } from "@/features/dashboard/services/statistics-service";
import type { DateRange } from "@/features/dashboard/types";

/** Balance (income minus expenses) of the signed-in user in cents, within `range` or all time when `null`. */
export async function getBalance(range: DateRange | null) {
  const { user } = await verifySession();
  return statisticsService.getBalance(user.id, range);
}
