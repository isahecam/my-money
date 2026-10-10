import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/features/auth/errors";
import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();
  const [isSigningOut, startSignOut] = useTransition();

  function signOut() {
    startSignOut(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/sign-in");
            router.refresh();
          },
          onError: ({ error, response }) => {
            toast.add({
              type: "error",
              title: getErrorMessage(
                error,
                response,
                "No se pudo cerrar sesión. Inténtalo de nuevo.",
              ),
            });
          },
        },
      });
    });
  }

  return { signOut, isSigningOut };
}
