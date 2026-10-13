import { createElement } from "react";
import type { ComponentType, ReactElement } from "react";

import type { EmailMessage, EmailRenderer } from "./types";

/**
 * Builds an `EmailMessage` step by step: recipient, subject and template, in any order.
 *
 * @example
 * const message = await new EmailBuilder(renderer)
 *   .to(user.email)
 *   .subject("Restablece tu contraseña")
 *   .template(PasswordResetEmail, { name: user.name, resetUrl })
 *   .build();
 */
export class EmailBuilder {
  readonly #renderer: EmailRenderer;
  #to?: string;
  #subject?: string;
  #template?: ReactElement;

  constructor(renderer: EmailRenderer) {
    this.#renderer = renderer;
  }

  to(address: string) {
    this.#to = address;
    return this;
  }

  subject(subject: string) {
    this.#subject = subject;
    return this;
  }

  template<P extends object>(component: ComponentType<P>, props: P) {
    this.#template = createElement(component, props);
    return this;
  }

  /** @throws Error when a step is missing. */
  async build() {
    if (!this.#to) throw new Error("EmailBuilder: missing recipient, call to().");
    if (!this.#subject) throw new Error("EmailBuilder: missing subject, call subject().");
    if (!this.#template) throw new Error("EmailBuilder: missing template, call template().");

    const { html, text } = await this.#renderer.render(this.#template);

    return { to: this.#to, subject: this.#subject, html, text } satisfies EmailMessage;
  }
}
