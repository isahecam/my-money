import { i18n, locales } from "@better-auth/i18n";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { after } from "next/server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  RESET_PASSWORD_TOKEN_EXPIRES_IN,
} from "@/features/auth/constants";
import { authEmailService } from "@/features/auth/services/auth-email-service";

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
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_TOKEN_EXPIRES_IN,
    // Returns the send promise so the background task below covers the whole send.
    // Better Auth already runs this through `backgroundTasks`; the response doesn't wait.
    sendResetPassword: ({ user, url }) => authEmailService.sendPasswordResetLink(user, url),
    // A reset may follow a compromised account: sign out every device.
    revokeSessionsOnPasswordReset: true,
    onPasswordReset: async ({ user }) => {
      auditLog("password.reset", { userId: user.id });
    },
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
  advanced: {
    backgroundTasks: {
      // Keeps the serverless function alive until the task settles, after the response is sent.
      handler: (promise) => after(promise),
    },
  },
  plugins: [
    // Spanish-only UI: with a single locale, every error falls back to "es".
    i18n({ translations: { es: locales.es }, defaultLocale: "es" }),
    // Must be the last plugin.
    nextCookies(),
  ],
});

/** @lintignore */
export type Session = typeof auth.$Infer.Session;
