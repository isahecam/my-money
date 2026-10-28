import { PasswordResetEmail } from "@/features/auth/emails/password-reset-email";
import type { PasswordResetEmailProps } from "@/features/auth/emails/password-reset-email";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : "http://localhost:3000";

// Preview entry for `pnpm email:dev`. The app imports the template from its feature.
export default function PasswordReset(props: Readonly<PasswordResetEmailProps>) {
  return <PasswordResetEmail {...props} />;
}

PasswordReset.PreviewProps = {
  name: "Ana",
  resetUrl:
    "https://finances.isahecam.com/api/auth/reset-password/abc123?callbackURL=%2Freset-password",
  expiresInMinutes: 60,
  // Served by the Next dev server from `public/static`.
  logoUrl: `${baseUrl}/static/logo.png`,
  homeUrl: "https://finances.isahecam.com",
} satisfies PasswordResetEmailProps;
