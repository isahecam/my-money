import type { ReactElement } from "react";
import { render, toPlainText } from "react-email";

import type { EmailRenderer } from "./types";

export class ReactEmailRenderer implements EmailRenderer {
  async render(template: ReactElement) {
    const html = await render(template);

    // Derived from the HTML so the template renders once.
    return { html, text: toPlainText(html) };
  }
}
