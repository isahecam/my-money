import { Column, Img, Link, Row, Section } from "react-email";

// Trimmed from emailcn `header-with-logo`: only the `minimal` variant, without the demo email,
// placeholder assets or fonts. Re-adding the upstream item overwrites this file.
export interface HeaderWithLogoProps {
  logoSrc: string;
  logoAlt: string;
  logoHref: string;
  pageBackgroundColor: string;
  backgroundColor: string;
  alignment?: "left" | "center" | "right";
}

export const HeaderWithLogoSection = ({
  logoSrc,
  logoAlt,
  logoHref,
  pageBackgroundColor,
  backgroundColor,
  alignment = "center",
}: HeaderWithLogoProps) => (
  <Section style={{ backgroundColor: pageBackgroundColor }} width="100%">
    <Row>
      <Column>&zwj;</Column>
      <Column style={{ maxWidth: "100%", width: "600px" }}>
        <Section width="100%">
          <Row>
            <Column style={{ backgroundColor, padding: "24px", textAlign: alignment }}>
              <Link href={logoHref}>
                <Img
                  alt={logoAlt}
                  src={logoSrc}
                  style={{ maxWidth: "100%", verticalAlign: "middle" }}
                  width={55}
                />
              </Link>
            </Column>
          </Row>
        </Section>
      </Column>
      <Column>&zwj;</Column>
    </Row>
  </Section>
);
