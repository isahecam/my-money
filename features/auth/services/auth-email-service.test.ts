import { describe, expect, it, vi } from "vitest";

import type { EmailProvider, EmailRenderer } from "@/lib/email";

import { AuthEmailService } from "./auth-email-service";

const renderer: EmailRenderer = {
  render: vi.fn(async () => ({ html: "<p>Restablece</p>", text: "Restablece" })),
};

describe("AuthEmailService", () => {
  it("sends the password reset email to the user", async () => {
    const provider: EmailProvider = { send: vi.fn(async () => {}) };

    await new AuthEmailService(provider, renderer).sendPasswordResetLink(
      { email: "tu@correo.com", name: "Ana" },
      "https://example.com/reset",
    );

    expect(provider.send).toHaveBeenCalledWith({
      to: "tu@correo.com",
      subject: "Restablece tu contraseña de My Money",
      html: "<p>Restablece</p>",
      text: "Restablece",
    });
    expect(renderer.render).toHaveBeenCalledWith(
      expect.objectContaining({
        props: {
          name: "Ana",
          resetUrl: "https://example.com/reset",
          expiresInMinutes: 60,
          logoUrl: "https://example.com/email/logo.png",
          homeUrl: "https://example.com",
        },
      }),
    );
  });

  it("propagates a provider failure so Better Auth logs it", async () => {
    const provider: EmailProvider = {
      send: vi.fn(async () => {
        throw new Error("Resend rejected the email");
      }),
    };

    await expect(
      new AuthEmailService(provider, renderer).sendPasswordResetLink(
        { email: "tu@correo.com", name: "Ana" },
        "https://example.com/reset",
      ),
    ).rejects.toThrow("Resend rejected the email");
  });
});
