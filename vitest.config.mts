import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Vite 8 resolves tsconfig `paths` (`@/*`) natively.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Fixed so date tests give the same result on every machine.
    env: { NEXT_PUBLIC_APP_TIMEZONE: "America/Mexico_City" },
    // Its ESM build imports `next/headers` without an extension, which Node can't resolve.
    server: { deps: { inline: ["@next-safe-action/adapter-better-auth"] } },
  },
});
