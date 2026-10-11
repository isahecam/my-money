import { statisticsRepository } from "@/features/dashboard/repositories/statistics-repository";
import type { DateRange, StatisticsRepository } from "@/features/dashboard/types";

/** @lintignore */
export class StatisticsService {
  constructor(private readonly repository: StatisticsRepository) {}

  /** Total income in cents within `range`, or all time when `null`. */
  getTotalIncome(userId: string, range: DateRange | null) {
    return this.repository.sumIncome(userId, range);
  }

  /** Total expenses in cents within `range`, or all time when `null`. */
  getTotalExpenses(userId: string, range: DateRange | null) {
    return this.repository.sumExpenses(userId, range);
  }

  /** Income minus expenses in cents within `range`, or all time when `null`. Negative when spending exceeds income. */
  async getBalance(userId: string, range: DateRange | null) {
    const [income, expenses] = await Promise.all([
      this.repository.sumIncome(userId, range),
      this.repository.sumExpenses(userId, range),
    ]);
    return income - expenses;
  }
}

export const statisticsService = new StatisticsService(statisticsRepository);
