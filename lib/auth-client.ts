import { i18nClient } from "@better-auth/i18n/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [i18nClient()],
});
