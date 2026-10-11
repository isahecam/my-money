import { verifySession } from "@/features/auth/dal";
import type { DateRange } from "@/features/dashboard/types";
import { transactionService } from "@/features/transactions/services/transaction-service";

/** The signed-in user's 10 most recent transactions, within `range` or all time when `null`. */
export async function getLatestTransactions(range: DateRange | null) {
  const { user } = await verifySession();
  return transactionService.getLatest(user.id, range);
}
