import { NextResponse } from "next/server";
import { dictionaries } from "@/data/i18n";
import {
  QUOTE_DESIGN,
  QUOTE_FEATURES,
  QUOTE_PAGES,
  QUOTE_PROJECT_TYPES,
  QUOTE_TIMELINES,
} from "@/data/i18n/types";
import { saveMessage } from "@/lib/messages/store";
import {
  EMAIL_RE,
  MailNotConfiguredError,
  clean,
  escapeHtml,
  mailErrorCode,
  sendMail,
} from "@/lib/mail";

// nodemailer needs the Node.js runtime; it cannot run on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_SUBJECT = "طلب عرض سعر";

/** Returns `value` if it is one of `allowed`, otherwise "". */
function pick<T extends string>(value: unknown, allowed: readonly T[]): T | "" {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : "";
}

function buildEmailHtml(rows: [string, string][], replyName: string, replyEmail: string): string {
  const body = rows
    .map(
      ([label, value]) => `
          <tr>
            <td style="padding-bottom:16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a1a1aa;">${escapeHtml(label)}</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#18181b;white-space:pre-wrap;">${escapeHtml(value).replace(/\n/g, "<br />")}</p>
            </td>
          </tr>`,
    )
    .join("");

  return `
<div style="margin:0;padding:32px 16px;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
    <tr>
      <td style="background-color:#111113;padding:24px 32px;">
        <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a1a1aa;">Portfolio Quote Request</p>
        <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff;">${escapeHtml(EMAIL_SUBJECT)}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${body}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 32px 28px;">
        <a href="mailto:${escapeHtml(replyEmail)}" style="display:inline-block;padding:11px 22px;background-color:#111113;color:#ffffff;font-size:13px;font-weight:600;border-radius:8px;text-decoration:none;">Reply to ${escapeHtml(replyName)}</a>
      </td>
    </tr>
  </table>
  <p style="max-width:560px;margin:20px auto 0;text-align:center;font-size:12px;color:#a1a1aa;">Sent from the quote form on your portfolio site. Promised reply time: within 5 hours.</p>
</div>`.trim();
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // A filled honeypot means a bot — accept quietly and send nothing.
  if (clean(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const projectType = pick(body.projectType, QUOTE_PROJECT_TYPES);
  const description = clean(body.description, 5000);
  const currentUrl = clean(body.currentUrl, 300);
  const pages = pick(body.pages, QUOTE_PAGES);
  const features = Array.isArray(body.features)
    ? [...new Set(body.features.map((f) => pick(f, QUOTE_FEATURES)))].filter(
        (f): f is (typeof QUOTE_FEATURES)[number] => f !== "",
      )
    : [];
  const design = pick(body.design, QUOTE_DESIGN);
  const timeline = pick(body.timeline, QUOTE_TIMELINES);
  const budget = clean(body.budget, 100);
  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const whatsapp = clean(body.whatsapp, 50);
  const country = clean(body.country, 100);
  const lang = body.lang === "ar" ? "ar" : "en";

  if (!projectType || !description || !name || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Project type, a description, a name, and a valid email are required." },
      { status: 422 },
    );
  }

  // Labels come from the English dictionary so the email reads the same
  // whichever language the visitor used.
  const t = dictionaries.en.quote;
  const dash = "—";
  const rows: [string, string][] = [
    ["Project type", t.projectType.options[projectType]],
    ["Idea", description],
    ["Current website", currentUrl || dash],
    ["Pages", pages ? t.pages.options[pages] : dash],
    ["Features", features.length ? features.map((f) => t.features.options[f]).join(", ") : dash],
    ["Design", design ? t.design.options[design] : dash],
    ["Timeline", timeline ? t.timeline.options[timeline] : dash],
    ["Budget", budget || dash],
    ["Name", name],
    ["Email", email],
    ["WhatsApp", whatsapp || dash],
    ["Country", country || dash],
    ["Form language", lang === "ar" ? "Arabic" : "English"],
  ];
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  // Best-effort: keep the request visible in /admin even if this fails or
  // the email send below fails.
  try {
    await saveMessage({ name, email, message: text, kind: "quote" });
  } catch (err) {
    console.error("Quote form: failed to save request for the dashboard.", err);
  }

  try {
    await sendMail({
      fromName: "Portfolio quote",
      replyToName: name,
      replyToEmail: email,
      subject: EMAIL_SUBJECT,
      text: `${EMAIL_SUBJECT}\n\n${text}`,
      html: buildEmailHtml(rows, name, email),
    });
  } catch (err) {
    if (err instanceof MailNotConfiguredError) {
      console.error(`Quote form: ${err.message}`);
      return NextResponse.json(
        { error: "The quote form is not configured on the server." },
        { status: 500 },
      );
    }
    const code = mailErrorCode(err);
    console.error(`Quote form: sendMail failed (${code}).`, err);
    return NextResponse.json(
      { error: "Could not send the request. Please email me directly.", code },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
