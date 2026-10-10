import * as v from "valibot";

export const signInSchema = v.object({
  email: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Ingresa tu correo electrónico."),
    v.email("Ingresa un correo electrónico válido."),
  ),
  password: v.pipe(v.string(), v.nonEmpty("Ingresa tu contraseña.")),
});
