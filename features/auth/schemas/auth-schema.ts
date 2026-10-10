import * as v from "valibot";

// `abortPipeEarly`: one message per field instead of every failed action.
export const signInSchema = v.config(
  v.object({
    email: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty("Ingresa tu correo electrónico."),
      v.email("Ingresa un correo electrónico válido."),
    ),
    password: v.pipe(v.string(), v.nonEmpty("Ingresa tu contraseña.")),
  }),
  { abortPipeEarly: true },
);
