import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveMessage } from "@/lib/messages/store";

// nodemailer needs the Node.js runtime; it cannot run on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot — real visitors never fill this. */
  company?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fixed subject for every submission — the sender's name/project details
// belong in the body, not the subject line.
const EMAIL_SUBJECT = "عميل محتمل";

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(name: string, email: string, message: string): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
<div style="margin:0;padding:32px 16px;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
    <tr>
      <td style="background-color:#111113;padding:24px 32px;">
        <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a1a1aa;">Portfolio Contact Form</p>
        <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff;">${escapeHtml(EMAIL_SUBJECT)}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding-bottom:16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a1a1aa;">Name</p>
              <p style="margin:0;font-size:15px;color:#18181b;">${safeName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:20px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a1a1aa;">Email</p>
              <p style="margin:0;font-size:15px;">
                <a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none;">${safeEmail}</a>
              </p>
            </td>
          </tr>
        </table>
        <div style="border-top:1px solid #e4e4e7;padding-top:20px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a1a1aa;">Project details</p>
          <p style="margin:0;font-size:15px;line-height:1.65;color:#27272a;white-space:pre-wrap;">${safeMessage}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 28px;">
        <a href="mailto:${safeEmail}" style="display:inline-block;padding:11px 22px;background-color:#111113;color:#ffffff;font-size:13px;font-weight:600;border-radius:8px;text-decoration:none;">Reply to ${safeName}</a>
      </td>
    </tr>
  </table>
  <p style="max-width:560px;margin:20px auto 0;text-align:center;font-size:12px;color:#a1a1aa;">Sent from the contact form on your portfolio site.</p>
</div>`.trim();
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  // A filled honeypot means a bot — accept quietly and send nothing.
  if (clean(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);

  if (!name || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Name, a valid email, and a message are all required." },
      { status: 422 },
    );
  }

  // Best-effort: keep the message visible in /admin even if this fails
  // (e.g. running under plain `next dev` without Netlify Blobs) or if the
  // email send below fails.
  try {
    await saveMessage({ name, email, message });
  } catch (err) {
    console.error("Contact form: failed to save message for the dashboard.", err);
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  const to = process.env.CONTACT_TO || user;

  if (!user || !pass) {
    console.error(
      "Contact form: GMAIL_USER and/or GMAIL_APP_PASSWORD are not set.",
    );
    return NextResponse.json(
      { error: "The contact form is not configured on the server." },
      { status: 500 },
    );
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

  try {
    await transporter.sendMail({
      from: `"Portfolio contact" <${user}>`,
      to,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: EMAIL_SUBJECT,
      text: `${EMAIL_SUBJECT}\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
      html: buildEmailHtml(name, email, message),
    });
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code?: unknown }).code)
        : "UNKNOWN";
    console.error(`Contact form: sendMail failed (${code}).`, err);
    return NextResponse.json(
      { error: "Could not send the message. Please email me directly.", code },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
