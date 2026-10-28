import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  description: "Crea una nueva contraseña para ingresar a tu cuenta.",
};

// No session redirect: the emailed link must work even if this browser is signed in.
export default async function ResetPasswordPage({
  searchParams,
}: Readonly<PageProps<"/reset-password">>) {
  // Better Auth redirects here with `?token=` or `?error=INVALID_TOKEN`.
  const { token, error } = await searchParams;

  if (error || typeof token !== "string" || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>Enlace inválido o expirado</h1>
          </CardTitle>
          <CardDescription>
            Este enlace para restablecer tu contraseña ya no es válido. Solicita uno nuevo.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/forgot-password" className={buttonVariants({ className: "w-full" })}>
            Solicitar un nuevo enlace
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1>Crea una nueva contraseña</h1>
        </CardTitle>
        <CardDescription>Elige una contraseña que no uses en otros sitios.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
