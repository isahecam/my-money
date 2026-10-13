import { RESET_PASSWORD_TOKEN_EXPIRES_IN } from "@/features/auth/constants";
import { PasswordResetEmail } from "@/features/auth/emails/password-reset-email";
import { email, EmailBuilder, emailRenderer } from "@/lib/email";
import type { EmailProvider, EmailRenderer } from "@/lib/email";

type Recipient = { email: string; name: string };

export class AuthEmailService {
  constructor(
    private readonly provider: EmailProvider,
    private readonly renderer: EmailRenderer,
  ) {}

  async sendPasswordResetLink(user: Recipient, resetUrl: string) {
    // The reset URL is absolute, so its origin is the app's public URL (served from `public/`).
    const { origin } = new URL(resetUrl);

    const message = await new EmailBuilder(this.renderer)
      .to(user.email)
      .subject("Restablece tu contraseña de My Money")
      .template(PasswordResetEmail, {
        name: user.name,
        resetUrl,
        expiresInMinutes: RESET_PASSWORD_TOKEN_EXPIRES_IN / 60,
        logoUrl: `${origin}/email/logo.png`,
        homeUrl: origin,
      })
      .build();

    await this.provider.send(message);
  }
}

export const authEmailService = new AuthEmailService(email, emailRenderer);
