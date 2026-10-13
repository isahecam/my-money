"use client";

import { Form, Field as FormischField } from "@formisch/react";
import { MailCheckIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";

const backToSignIn = (
  <FieldDescription className="text-center">
    <Link href="/sign-in">Volver a iniciar sesión</Link>
  </FieldDescription>
);

export function ForgotPasswordForm() {
  const { form, handleSubmit, sentTo } = useForgotPassword();

  // Same message whether or not the account exists, so the page can't be used to find accounts.
  if (sentTo) {
    return (
      <FieldGroup>
        <Alert>
          <MailCheckIcon />
          <AlertTitle>Revisa tu correo</AlertTitle>
          <AlertDescription>
            <p>
              Si existe una cuenta con <strong>{sentTo}</strong>, te enviamos un enlace para
              restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.
            </p>
          </AlertDescription>
        </Alert>
        <Field>{backToSignIn}</Field>
      </FieldGroup>
    );
  }

  return (
    <Form of={form} onSubmit={handleSubmit}>
      <FieldGroup>
        <FormischField of={form} path={["email"]}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="forgot-password-email">Correo electrónico</FieldLabel>
              <Input
                {...field.props}
                id="forgot-password-email"
                type="email"
                value={field.input ?? ""}
                aria-invalid={field.errors !== null}
                autoComplete="email"
                placeholder="tu@correo.com"
              />
              {field.errors && <FieldError errors={field.errors.map((message) => ({ message }))} />}
            </Field>
          )}
        </FormischField>

        <Field>
          <Button type="submit" disabled={form.isSubmitting}>
            {form.isSubmitting && <Spinner data-icon="inline-start" />}
            Enviar enlace
          </Button>
          {backToSignIn}
        </Field>
      </FieldGroup>
    </Form>
  );
}
