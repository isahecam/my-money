import { Resend } from "resend";

import type { EmailMessage, EmailProvider } from "./types";

export class ResendAdapter implements EmailProvider {
  readonly #client: Resend;
  readonly #from: string;

  constructor(apiKey: string, from: string) {
    this.#client = new Resend(apiKey);
    this.#from = from;
  }

  async send({ to, subject, html, text }: EmailMessage) {
    const { error } = await this.#client.emails.send({ from: this.#from, to, subject, html, text });

    // The SDK returns errors instead of throwing them.
    if (error) throw new Error(`Resend rejected the email: ${error.name}: ${error.message}`);
  }
}
