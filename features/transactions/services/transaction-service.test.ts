import { describe, expect, it, vi } from "vitest";

import type { TransactionRepository } from "@/features/transactions/types";

import { TransactionService } from "./transaction-service";

// The module also builds the real repository, which imports `db` and needs `DATABASE_URL`.
vi.mock("@/features/transactions/repositories/transaction-repository", () => ({
  transactionRepository: {},
}));

function fakeRepository(total: number) {
  return {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findLatest: vi.fn(),
    findPage: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(total),
  } satisfies TransactionRepository;
}

describe("TransactionService.getPage", () => {
  it("reads the requested page when it's in range", async () => {
    const repository = fakeRepository(25);
    const result = await new TransactionService(repository).getPage("user", {
      page: 2,
      pageSize: 10,
    });

    expect(repository.findPage).toHaveBeenCalledWith("user", 10, 10);
    expect(result).toMatchObject({ total: 25, page: 2, pageSize: 10 });
  });

  it("falls back to the last page when the page is past the end", async () => {
    const repository = fakeRepository(12);
    const result = await new TransactionService(repository).getPage("user", {
      page: 99,
      pageSize: 10,
    });

    expect(repository.findPage).toHaveBeenCalledWith("user", 10, 10);
    expect(result.page).toBe(2);
  });

  it("falls back to the first page when the page is below 1", async () => {
    const repository = fakeRepository(12);
    const result = await new TransactionService(repository).getPage("user", {
      page: -4,
      pageSize: 10,
    });

    expect(repository.findPage).toHaveBeenCalledWith("user", 10, 0);
    expect(result.page).toBe(1);
  });

  it("stays on page 1 without transactions", async () => {
    const repository = fakeRepository(0);
    const result = await new TransactionService(repository).getPage("user", {
      page: 3,
      pageSize: 10,
    });

    expect(repository.findPage).toHaveBeenCalledWith("user", 10, 0);
    expect(result).toMatchObject({ total: 0, page: 1 });
  });

  it("clamps the page size to 1–50", async () => {
    const repository = fakeRepository(120);
    const service = new TransactionService(repository);

    expect((await service.getPage("user", { page: 1, pageSize: 1000 })).pageSize).toBe(50);
    expect((await service.getPage("user", { page: 1, pageSize: 0 })).pageSize).toBe(1);
  });
});
