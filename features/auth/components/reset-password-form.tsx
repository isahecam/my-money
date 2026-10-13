"use client";

import { Form, Field as FormischField } from "@formisch/react";

import { PasswordInput } from "@/components/customs/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/features/auth/constants";
import { useResetPassword } from "@/features/auth/hooks/use-reset-password";

export function ResetPasswordForm({ token }: Readonly<{ token: string }>) {
  const { form, handleSubmit } = useResetPassword(token);

  return (
    <Form of={form} onSubmit={handleSubmit}>
      <FieldGroup>
        <FormischField of={form} path={["password"]}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="reset-password-password">Nueva contraseña</FieldLabel>
              <PasswordInput
                {...field.props}
                id="reset-password-password"
                value={field.input ?? ""}
                aria-invalid={field.errors !== null}
                autoComplete="new-password"
              />
              {field.errors ? (
                <FieldError errors={field.errors.map((message) => ({ message }))} />
              ) : (
                <FieldDescription>
                  Entre {PASSWORD_MIN_LENGTH} y {PASSWORD_MAX_LENGTH} caracteres.
                </FieldDescription>
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={["confirmPassword"]}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="reset-password-confirm-password">
                Confirma tu nueva contraseña
              </FieldLabel>
              <PasswordInput
                {...field.props}
                id="reset-password-confirm-password"
                value={field.input ?? ""}
                aria-invalid={field.errors !== null}
                autoComplete="new-password"
              />
              {field.errors && <FieldError errors={field.errors.map((message) => ({ message }))} />}
            </Field>
          )}
        </FormischField>

        <Field>
          <Button type="submit" disabled={form.isSubmitting}>
            {form.isSubmitting && <Spinner data-icon="inline-start" />}
            Guardar contraseña
          </Button>
        </Field>
      </FieldGroup>
    </Form>
  );
}
