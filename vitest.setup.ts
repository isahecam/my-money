import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Without Vitest globals, Testing Library doesn't clean up on its own.
afterEach(cleanup);
