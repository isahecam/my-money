import { describe, expect, it, vi } from "vitest";

import { EmailBuilder } from "./email-builder";
import type { EmailRenderer } from "./types";

function Greeting({ name }: { name: string }) {
  return <p>Hola, {name}</p>;
}

const renderer: EmailRenderer = {
  render: vi.fn(async () => ({ html: "<p>Hola, Ana</p>", text: "Hola, Ana" })),
};

describe("EmailBuilder", () => {
  it("builds the message with the rendered template", async () => {
    const message = await new EmailBuilder(renderer)
      .to("tu@correo.com")
      .subject("Asunto")
      .template(Greeting, { name: "Ana" })
      .build();

    expect(message).toEqual({
      to: "tu@correo.com",
      subject: "Asunto",
      html: "<p>Hola, Ana</p>",
      text: "Hola, Ana",
    });
    expect(renderer.render).toHaveBeenCalledWith(
      expect.objectContaining({ type: Greeting, props: { name: "Ana" } }),
    );
  });

  it("accepts the steps in any order", async () => {
    const message = await new EmailBuilder(renderer)
      .template(Greeting, { name: "Ana" })
      .subject("Asunto")
      .to("tu@correo.com")
      .build();

    expect(message.to).toBe("tu@correo.com");
  });

  it.each([
    ["recipient", new EmailBuilder(renderer).subject("Asunto").template(Greeting, { name: "Ana" })],
    ["subject", new EmailBuilder(renderer).to("tu@correo.com").template(Greeting, { name: "Ana" })],
    ["template", new EmailBuilder(renderer).to("tu@correo.com").subject("Asunto")],
  ])("throws without a %s", async (step, builder) => {
    await expect(builder.build()).rejects.toThrow(`missing ${step}`);
  });
});
