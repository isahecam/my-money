import * as v from "valibot";

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/features/auth/constants";

const email = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Ingresa tu correo electrónico."),
  v.email("Ingresa un correo electrónico válido."),
);

// `abortPipeEarly`: one message per field instead of every failed action.
export const signInSchema = v.config(
  v.object({
    email,
    password: v.pipe(v.string(), v.nonEmpty("Ingresa tu contraseña.")),
  }),
  { abortPipeEarly: true },
);

export const forgotPasswordSchema = v.config(v.object({ email }), { abortPipeEarly: true });

export const resetPasswordSchema = v.config(
  v.pipe(
    v.object({
      password: v.pipe(
        v.string(),
        v.nonEmpty("Ingresa tu nueva contraseña."),
        v.minLength(
          PASSWORD_MIN_LENGTH,
          `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`,
        ),
        v.maxLength(
          PASSWORD_MAX_LENGTH,
          `La contraseña debe tener como máximo ${PASSWORD_MAX_LENGTH} caracteres.`,
        ),
      ),
      confirmPassword: v.pipe(v.string(), v.nonEmpty("Confirma tu nueva contraseña.")),
    }),
    // Reported on `confirmPassword`, so Formisch shows it under that field.
    v.forward(
      v.partialCheck(
        [["password"], ["confirmPassword"]],
        (input) => input.password === input.confirmPassword,
        "Las contraseñas no coinciden.",
      ),
      ["confirmPassword"],
    ),
  ),
  { abortPipeEarly: true },
);
