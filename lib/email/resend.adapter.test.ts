import { beforeEach, describe, expect, it, vi } from "vitest";

import { ResendAdapter } from "./resend.adapter";

const send = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const message = { to: "tu@correo.com", subject: "Asunto", html: "<p>Cuerpo</p>", text: "Cuerpo" };

describe("ResendAdapter", () => {
  beforeEach(() => {
    send.mockReset();
  });

  it("sends both bodies from the configured address", async () => {
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });

    await new ResendAdapter("re_test", "My Money <no-reply@example.com>").send(message);

    expect(send).toHaveBeenCalledWith({ from: "My Money <no-reply@example.com>", ...message });
  });

  it("throws when Resend rejects the email", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "Invalid `to` field." },
    });

    await expect(
      new ResendAdapter("re_test", "no-reply@example.com").send(message),
    ).rejects.toThrow("Resend rejected the email: validation_error: Invalid `to` field.");
  });
});
