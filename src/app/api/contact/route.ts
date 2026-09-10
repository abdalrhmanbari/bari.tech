import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
      subject: `Portfolio enquiry from ${name}`,
      text: `${message}\n\n— ${name}\n${email}`,
      html:
        `<p style="white-space:pre-wrap;margin:0 0 16px">${escapeHtml(message)}</p>` +
        `<hr style="border:none;border-top:1px solid #ddd" />` +
        `<p style="margin:16px 0 0"><strong>${escapeHtml(name)}</strong><br />` +
        `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
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
