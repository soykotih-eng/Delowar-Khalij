import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { siteConfig } from "./config";

/**
 * Outgoing email (SMTP). Set in Hostinger → Environment variables:
 *   SMTP_HOST  e.g. smtp.hostinger.com (Hostinger email) or smtp.gmail.com
 *   SMTP_PORT  465 (default, SSL) or 587
 *   SMTP_USER  the full mailbox address
 *   SMTP_PASS  its password (for Gmail: an App Password)
 *   SMTP_FROM  optional sender address (defaults to SMTP_USER)
 */
export const isMailConfigured = () =>
  Boolean(process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS);

const store = globalThis as unknown as { __dakMail?: Transporter };

function transport() {
  const port = Number(process.env.SMTP_PORT?.trim() || 465);
  store.__dakMail ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim(),
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER?.trim(), pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return store.__dakMail;
}

export async function sendMail({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
  await transport().sendMail({
    from: { name: siteConfig.name, address: process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim() },
    to,
    subject,
    text,
    html,
  });
}
