import nodemailer from "nodemailer";

// Shared Gmail-SMTP delivery for the contact and quote forms. nodemailer
// needs the Node.js runtime, so routes importing this must set
// `export const runtime = "nodejs"`.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export class MailNotConfiguredError extends Error {}

type OutgoingMail = {
  /** Display name for the From header, e.g. "Portfolio contact". */
  fromName: string;
  replyToName: string;
  replyToEmail: string;
  subject: string;
  text: string;
  html: string;
};

/**
 * Sends to CONTACT_TO (defaults to GMAIL_USER). Throws MailNotConfiguredError
 * when the SMTP env vars are missing, or the nodemailer error on failure.
 */
export async function sendMail(mail: OutgoingMail): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  const to = process.env.CONTACT_TO || user;

  if (!user || !pass) {
    throw new MailNotConfiguredError("GMAIL_USER and/or GMAIL_APP_PASSWORD are not set.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    // Fail fast when the SMTP connection is blocked or slow (common on
    // serverless hosts) instead of hanging until the function is killed.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  await transporter.sendMail({
    from: `"${mail.fromName}" <${user}>`,
    to,
    replyTo: `"${mail.replyToName.replace(/"/g, "")}" <${mail.replyToEmail}>`,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
}

/** nodemailer attaches a `code` (e.g. EAUTH) to its errors; useful in logs and responses. */
export function mailErrorCode(err: unknown): string {
  return err && typeof err === "object" && "code" in err
    ? String((err as { code?: unknown }).code)
    : "UNKNOWN";
}
