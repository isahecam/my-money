import { verifySession } from "@/features/auth/dal";
import { transactionService } from "@/features/transactions/services/transaction-service";
import type { Pagination } from "@/features/transactions/types";

/** One page of the signed-in user's transactions, most recent first, with the total count. */
export async function getTransactions(pagination: Pagination) {
  const { user } = await verifySession();
  return transactionService.getPage(user.id, pagination);
}
