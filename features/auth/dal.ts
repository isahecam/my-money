import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

// Secure check against the DB, deduped per render pass.
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

// Call at the top of every protected page and Route Handler. Server Actions use `authActionClient`.
export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  return session;
});
