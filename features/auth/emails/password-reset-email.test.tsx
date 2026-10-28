import { describe, expect, it } from "vitest";

import { myMoneyTheme } from "@/components/email/theme-my-money";
import { ReactEmailRenderer } from "@/lib/email/react-email.adapter";

import { PasswordResetEmail } from "./password-reset-email";

const resetUrl = "https://example.com/api/auth/reset-password/abc?callbackURL=x";

describe("PasswordResetEmail", async () => {
  const { html, text } = await new ReactEmailRenderer().render(
    <PasswordResetEmail
      name="Ana"
      resetUrl={resetUrl}
      expiresInMinutes={60}
      logoUrl="https://example.com/static/logo.png"
      homeUrl="https://example.com"
    />,
  );

  it("is in Spanish", () => {
    expect(html).toContain('lang="es"');
    expect(html).not.toContain('lang="en"');
  });

  it("links the button to the reset URL", () => {
    expect(html).toContain(`href="${resetUrl}"`);
  });

  it("shows the logo from an absolute URL, linked to the app", () => {
    expect(html).toContain('src="https://example.com/static/logo.png"');
    expect(html).toContain('alt="My Money"');
    expect(html).toContain('href="https://example.com"');
  });

  it("styles the button with the app theme", () => {
    // `bg-brand` is #c96442; an unresolved class would leave no background at all.
    expect(myMoneyTheme.colorPrimary).toBe("#c96442");
    expect(html).toMatch(/background-color:\s*rgb\(201,\s*100,\s*66\)/i);
    expect(html).toMatch(/color:\s*rgb\(255,\s*255,\s*255\)/i);
  });

  it("has a plain-text body with the greeting, link and expiry", () => {
    expect(text).toContain("Hola, Ana.");
    expect(text).toContain(resetUrl);
    expect(text).toContain("caduca en 60 minutos");
  });
});
