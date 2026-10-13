import { useForm } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
import { useState } from "react";

import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/features/auth/errors";
import { forgotPasswordSchema } from "@/features/auth/schemas/auth-schema";
import { authClient } from "@/lib/auth-client";

export function useForgotPassword() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm({
    schema: forgotPasswordSchema,
    initialInput: { email: "" },
  });

  const handleSubmit: SubmitHandler<typeof forgotPasswordSchema> = async ({ email }) => {
    await authClient.requestPasswordReset(
      {
        email,
        // Absolute, as Better Auth recommends. It appends `?token=` or `?error=INVALID_TOKEN`.
        redirectTo: new URL("/reset-password", window.location.origin).href,
      },
      {
        onSuccess: () => setSentTo(email),
        onError: ({ error, response }) => {
          toast.add({
            type: "error",
            title: getErrorMessage(
              error,
              response,
              "No se pudo enviar el enlace. Inténtalo de nuevo.",
            ),
          });
        },
      },
    );
  };

  return { form, handleSubmit, sentTo };
}
