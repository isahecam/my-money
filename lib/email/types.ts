import type { ReactElement } from "react";

type RenderedEmail = {
  html: string;
  text: string;
};

export type EmailMessage = RenderedEmail & {
  to: string;
  subject: string;
};

/** Sends transactional email. The sender address is fixed by the adapter. */
export interface EmailProvider {
  /** @throws Error when the provider rejects the message, so callers can log it. */
  send(message: EmailMessage): Promise<void>;
}

/** Turns an email template into the HTML and plain-text bodies. */
export interface EmailRenderer {
  render(template: ReactElement): Promise<RenderedEmail>;
}
