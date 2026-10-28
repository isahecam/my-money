import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { getSession } from "@/features/auth/dal";

export const metadata: Metadata = {
  title: "Recuperación de contraseña",
  description: "Ingresa tu correo y te enviaremos un enlace para crear una nueva.",
};

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1>Recupera tu contraseña</h1>
        </CardTitle>
        <CardDescription>
          Ingresa tu correo y te enviaremos un enlace para crear una nueva.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
