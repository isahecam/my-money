import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { PasswordInput } from "@/components/customs/password-input";

describe("PasswordInput", () => {
  test("hides the password by default", () => {
    render(<PasswordInput id="password" aria-label="Contraseña" />);

    expect(screen.getByLabelText("Contraseña").getAttribute("type")).toBe("password");
  });

  test("toggles the password visibility", () => {
    render(<PasswordInput id="password" aria-label="Contraseña" />);

    fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
    expect(screen.getByLabelText("Contraseña").getAttribute("type")).toBe("text");

    fireEvent.click(screen.getByRole("button", { name: "Ocultar contraseña" }));
    expect(screen.getByLabelText("Contraseña").getAttribute("type")).toBe("password");
  });
});
