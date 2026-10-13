import { Body, Button, Container, Head, Html, Preview, Section, Tailwind, Text } from "react-email";

import { createEmailTailwindConfig } from "@/components/email/email-theme";
import { HeaderWithLogoSection } from "@/components/email/header-with-logo";
import { myMoneyTheme } from "@/components/email/theme-my-money";

export type PasswordResetEmailProps = {
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
  /** Absolute URL: email clients can't load relative images. */
  logoUrl: string;
  homeUrl: string;
};

// Based on emailcn `block-auth-password-reset-default`, with classes mapped to its theme tokens.
export function PasswordResetEmail({
  name,
  resetUrl,
  expiresInMinutes,
  logoUrl,
  homeUrl,
}: Readonly<PasswordResetEmailProps>) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Restablece tu contraseña de My Money</Preview>
      <Tailwind config={createEmailTailwindConfig(myMoneyTheme)}>
        {/* `Body` defaults `lang` to "en" on both the body and its wrapper cell. */}
        <Body lang="es" className="bg-bg font-sans">
          <HeaderWithLogoSection
            logoSrc={logoUrl}
            logoAlt="My Money"
            logoHref={homeUrl}
            pageBackgroundColor={myMoneyTheme.colorBackground}
            backgroundColor={myMoneyTheme.colorBackground}
          />
          <Container className="max-w-email mx-auto px-6 pt-4 pb-8">
            <Section>
              <Text className="text-fg mt-0 mb-4 text-xl font-medium">
                Restablece tu contraseña
              </Text>
              <Text className="text-fg-2 mt-0 mb-4 text-base leading-snug">
                Hola, {name}. Recibimos una solicitud para restablecer la contraseña de tu cuenta de
                My Money. Si fuiste tú, usa el botón de abajo para elegir una nueva.
              </Text>
              <Text className="text-fg-2 mt-0 mb-6 text-base leading-snug">
                Por seguridad, el enlace caduca en {expiresInMinutes} minutos y solo se puede usar
                una vez.
              </Text>
            </Section>

            <Section className="pb-6">
              <Button
                href={resetUrl}
                className="bg-brand text-brand-fg inline-block rounded px-6 py-3 text-base font-medium no-underline">
                Restablecer contraseña
              </Button>
            </Section>

            <Text className="text-fg-2 mt-0 mb-3 text-sm leading-snug">
              Si no lo solicitaste, puedes ignorar este correo: tu contraseña actual seguirá igual y
              no se hará ningún cambio.
            </Text>
            <Text className="text-fg-2 my-0 text-sm leading-snug">
              My Money nunca te pedirá tu contraseña por correo ni por mensaje. Si algo te parece
              sospechoso, no abras el enlace.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
