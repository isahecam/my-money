// Usage: pnpm auth:create-user --email you@example.com --name "Your Name"
import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { parseArgs } from "node:util";

import { auth } from "@/lib/auth";

async function promptHidden(question: string): Promise<string> {
  let muted = false;
  const output = new Writable({
    write(chunk, encoding, callback) {
      if (!muted) process.stdout.write(chunk, encoding);
      callback();
    },
  });
  const rl = createInterface({ input: process.stdin, output, terminal: true });

  const answer = rl.question(question);
  muted = true;
  const value = await answer;

  rl.close();
  process.stdout.write("\n");
  return value;
}

async function main() {
  const { values } = parseArgs({
    options: { email: { type: "string" }, name: { type: "string" } },
  });
  const email = values.email?.trim().toLowerCase();
  const name = values.name?.trim();

  if (!email || !name) {
    throw new Error('Usage: pnpm auth:create-user --email you@example.com --name "Your Name"');
  }

  const ctx = await auth.$context;
  const { minPasswordLength, maxPasswordLength } = ctx.password.config;

  const password = await promptHidden("Password: ");
  if (password.length < minPasswordLength || password.length > maxPasswordLength) {
    throw new Error(`Password must be ${minPasswordLength}-${maxPasswordLength} characters.`);
  }
  if (password !== (await promptHidden("Confirm password: "))) {
    throw new Error("Passwords do not match.");
  }

  if (await ctx.internalAdapter.findUserByEmail(email)) {
    throw new Error(`A user with email ${email} already exists.`);
  }

  // Mirrors Better Auth internal sign-up.
  const user = await ctx.internalAdapter.createUser(
    { email, name, emailVerified: true },
    { method: "admin" },
  );
  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    providerId: "credential",
    accountId: user.id,
    password: await ctx.password.hash(password),
  });

  console.log(`User created (${user.id}).`);
}

main().catch((error: unknown) => {
  console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
