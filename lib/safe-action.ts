import { betterAuth } from "@next-safe-action/adapter-better-auth";
import { createSafeActionClient, returnServerError } from "next-safe-action";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/** `result.serverError` shape, for both expected and unexpected errors. */
type ActionError = { reason: string; message: { title: string; description: string } };

const actionClient = createSafeActionClient({
  // Forms are flat, so `{ formErrors, fieldErrors }` maps straight onto form fields.
  defaultValidationErrorsShape: "flattened",
  handleServerError: (error): ActionError => {
    console.error("Action error:", error);
    return {
      reason: "UNEXPECTED",
      message: {
        title: "Algo salió mal",
        description: "No pudimos completar la acción. Inténtalo de nuevo.",
      },
    };
  },
});

/** Typed `returnServerError` for expected business errors. Bypasses `handleServerError`. */
export const returnActionError: (error: ActionError) => never = returnServerError;

export const authActionClient = actionClient.use(
  betterAuth(auth, {
    // Redirect like the DAL does; the default `unauthorized()` needs `authInterrupts`.
    authorize: ({ authData, next }) => {
      if (!authData) redirect("/sign-in");

      return next({ ctx: { auth: authData } });
    },
  }),
);
