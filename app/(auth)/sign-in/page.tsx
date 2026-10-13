import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { getSession } from "@/features/auth/dal";

export const metadata: Metadata = {
  title: "Iniciar sesión · My Money",
};

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1>Iniciar sesión</h1>
        </CardTitle>
        <CardDescription>Ingresa con tu correo y contraseña.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
}
