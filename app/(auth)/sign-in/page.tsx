import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Logo } from "@/components/layouts/logo";
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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
      <header className="flex h-14 items-center gap-2 px-3 py-2">
        <Logo />
      </header>
      <main className="w-full max-w-sm">
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
      </main>
    </div>
  );
}
