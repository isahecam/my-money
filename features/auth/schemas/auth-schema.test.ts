import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/features/auth/constants";

import { forgotPasswordSchema, resetPasswordSchema, signInSchema } from "./auth-schema";

function issues(schema: v.GenericSchema, input: unknown) {
  const result = v.safeParse(schema, input);
  return result.issues?.map((issue) => [v.getDotPath(issue), issue.message]);
}

const password = "a".repeat(PASSWORD_MIN_LENGTH);

describe("signInSchema", () => {
  it("accepts a valid sign-in", () => {
    expect(v.safeParse(signInSchema, { email: "tu@correo.com", password: "x" }).success).toBe(true);
  });

  it("does not enforce the password length", () => {
    expect(issues(signInSchema, { email: "tu@correo.com", password: "" })).toEqual([
      ["password", "Ingresa tu contraseña."],
    ]);
  });
});

describe("forgotPasswordSchema", () => {
  it("trims the email", () => {
    const result = v.safeParse(forgotPasswordSchema, { email: "  tu@correo.com " });
    expect(result.output).toEqual({ email: "tu@correo.com" });
  });

  it.each([
    ["", "Ingresa tu correo electrónico."],
    ["   ", "Ingresa tu correo electrónico."],
    ["tu@correo", "Ingresa un correo electrónico válido."],
  ])("rejects email %j", (email, message) => {
    expect(issues(forgotPasswordSchema, { email })).toEqual([["email", message]]);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts matching passwords", () => {
    expect(v.safeParse(resetPasswordSchema, { password, confirmPassword: password }).success).toBe(
      true,
    );
  });

  it.each([
    ["an empty password", "", "Ingresa tu nueva contraseña."],
    [
      "a too short password",
      "a".repeat(PASSWORD_MIN_LENGTH - 1),
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`,
    ],
    [
      "a too long password",
      "a".repeat(PASSWORD_MAX_LENGTH + 1),
      `La contraseña debe tener como máximo ${PASSWORD_MAX_LENGTH} caracteres.`,
    ],
  ])("rejects %s", (_label, value, message) => {
    expect(issues(resetPasswordSchema, { password: value, confirmPassword: password })).toEqual([
      ["password", message],
    ]);
  });

  it("requires the confirmation", () => {
    expect(issues(resetPasswordSchema, { password, confirmPassword: "" })).toEqual([
      ["confirmPassword", "Confirma tu nueva contraseña."],
    ]);
  });

  it("reports a mismatch on confirmPassword", () => {
    expect(issues(resetPasswordSchema, { password, confirmPassword: `${password}b` })).toEqual([
      ["confirmPassword", "Las contraseñas no coinciden."],
    ]);
  });
});
