"use client";

import { Form, Field as FormischField } from "@formisch/react";

import { PasswordInput } from "@/components/customs/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSignIn } from "@/features/auth/hooks/use-sign-in";

export function SignInForm() {
  const { form, handleSubmit } = useSignIn();

  return (
    <Form of={form} onSubmit={handleSubmit}>
      <FieldGroup>
        <FormischField of={form} path={["email"]}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="sign-in-email">Correo electrónico</FieldLabel>
              <Input
                {...field.props}
                id="sign-in-email"
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

        <FormischField of={form} path={["password"]}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="sign-in-password">Contraseña</FieldLabel>
              <PasswordInput
                {...field.props}
                id="sign-in-password"
                value={field.input ?? ""}
                aria-invalid={field.errors !== null}
                autoComplete="current-password"
              />
              {field.errors && <FieldError errors={field.errors.map((message) => ({ message }))} />}
            </Field>
          )}
        </FormischField>

        <Field>
          <Button type="submit" disabled={form.isSubmitting}>
            {form.isSubmitting && <Spinner data-icon="inline-start" />}
            Iniciar sesión
          </Button>
        </Field>
      </FieldGroup>
    </Form>
  );
}
