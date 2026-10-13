import { ReactEmailRenderer } from "./react-email.adapter";
import { ResendAdapter } from "./resend.adapter";

export * from "./email-builder";
export * from "./types";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY (Resend API key).");
}

if (!process.env.EMAIL_FROM) {
  throw new Error('Missing EMAIL_FROM (sender, e.g. "My Money <no-reply@example.com>").');
}

export const email = new ResendAdapter(process.env.RESEND_API_KEY, process.env.EMAIL_FROM);

export const emailRenderer = new ReactEmailRenderer();
