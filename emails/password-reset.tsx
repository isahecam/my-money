import { PasswordResetEmail } from "@/features/auth/emails/password-reset-email";
import type { PasswordResetEmailProps } from "@/features/auth/emails/password-reset-email";

// Preview entry for `pnpm email:dev`. The app imports the template from its feature.
export default function PasswordReset(props: Readonly<PasswordResetEmailProps>) {
  return <PasswordResetEmail {...props} />;
}

PasswordReset.PreviewProps = {
  name: "Ana",
  resetUrl:
    "https://my-money.example.com/api/auth/reset-password/abc123?callbackURL=%2Freset-password",
  expiresInMinutes: 60,
  // Served by the preview server from `emails/static`; the app serves `public/email`.
  logoUrl: "/static/logo.png",
  homeUrl: "https://my-money.example.com",
} satisfies PasswordResetEmailProps;
