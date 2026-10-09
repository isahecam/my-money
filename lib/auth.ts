import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as schema from "@/db/schema";

// JSON audit log. Never log the token.
function auditLog(event: string, data: Record<string, unknown>) {
  console.info(JSON.stringify({ type: "audit", event, at: new Date().toISOString(), ...data }));
}

// Secret and baseURL come from env.
export const auth = betterAuth({
  appName: "My Money",
  database: drizzleAdapter(db, { provider: "pg", usePlural: true, schema }),
  emailAndPassword: {
    enabled: true,
    // Users are created via `pnpm auth:create-user`.
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    // "memory" does not work on serverless.
    storage: "database",
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          auditLog("session.created", {
            sessionId: session.id,
            userId: session.userId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
          });
        },
      },
      delete: {
        // Sign-out, revocation or expiry.
        before: async (session) => {
          auditLog("session.deleted", { sessionId: session.id, userId: session.userId });
        },
      },
    },
  },
  // Must be the last plugin.
  plugins: [nextCookies()],
});

/** @lintignore */
export type Session = typeof auth.$Infer.Session;
