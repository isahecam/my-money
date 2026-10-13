import { useForm } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/features/auth/errors";
import { resetPasswordSchema } from "@/features/auth/schemas/auth-schema";
import { authClient } from "@/lib/auth-client";

export function useResetPassword(token: string) {
  const router = useRouter();
  const form = useForm({
    schema: resetPasswordSchema,
    initialInput: { password: "", confirmPassword: "" },
  });

  const handleSubmit: SubmitHandler<typeof resetPasswordSchema> = async ({ password }) => {
    await authClient.resetPassword(
      { newPassword: password, token },
      {
        onSuccess: () => {
          toast.add({
            type: "success",
            title: "Contraseña actualizada",
            description: "Ya puedes iniciar sesión con tu nueva contraseña.",
          });
          router.replace("/sign-in");
        },
        onError: ({ error, response }) => {
          toast.add({
            type: "error",
            title: getErrorMessage(
              error,
              response,
              "No se pudo actualizar la contraseña. Inténtalo de nuevo.",
            ),
          });
        },
      },
    );
  };

  return { form, handleSubmit };
}
