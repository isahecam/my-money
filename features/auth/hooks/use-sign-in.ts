import { useForm } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/features/auth/errors";
import { signInSchema } from "@/features/auth/schemas/auth-schema";
import { authClient } from "@/lib/auth-client";

export function useSignIn() {
  const router = useRouter();
  const form = useForm({
    schema: signInSchema,
    initialInput: { email: "", password: "" },
  });

  const handleSubmit: SubmitHandler<typeof signInSchema> = async ({ email, password }) => {
    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => {
          router.replace("/");
          router.refresh();
        },
        onError: ({ error, response }) => {
          toast.add({
            type: "error",
            title: getErrorMessage(
              error,
              response,
              "No se pudo iniciar sesión. Inténtalo de nuevo.",
            ),
          });
        },
      },
    );
  };

  return { form, handleSubmit };
}
