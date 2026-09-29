import { NextResponse } from "next/server";
import { saveReview } from "@/lib/reviews/store";
import { clean, escapeHtml, mailErrorCode, sendMail } from "@/lib/mail";

// nodemailer needs the Node.js runtime; it cannot run on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_SUBJECT = "تقييم جديد من عميل";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // A filled honeypot means a bot — accept quietly and store nothing.
  if (clean(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const role = clean(body.role, 150);
  const project = clean(body.project, 150);
  const text = clean(body.text, 2000);
  const rating = Number(body.rating);
  const lang = body.lang === "ar" ? "ar" : "en";

  if (!name || !project || !text || !Number.isInteger(rating) || rating < 1 || rating > 5 || body.consent !== true) {
    return NextResponse.json(
      { error: "Name, project, a 1–5 rating, a review, and consent are required." },
      { status: 422 },
    );
  }

  try {
    await saveReview({ name, role, project, rating, text, lang });
  } catch (err) {
    console.error("Review form: failed to save review.", err);
    return NextResponse.json({ error: "Could not save your review. Please try again." }, { status: 503 });
  }

  // Best-effort heads-up; the review is already saved for approval in /admin.
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  try {
    await sendMail({
      fromName: "Portfolio review",
      replyToName: name,
      replyToEmail: process.env.CONTACT_TO || process.env.GMAIL_USER || "",
      subject: EMAIL_SUBJECT,
      text: `${EMAIL_SUBJECT}\n\n${name}${role ? ` — ${role}` : ""}\nProject: ${project}\nRating: ${stars}\n\n${text}\n\nApprove it in /admin/reviews to show it on the site.`,
      html: `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#18181b;">
  <p style="margin:0 0 4px;font-size:18px;font-weight:700;">${escapeHtml(EMAIL_SUBJECT)}</p>
  <p style="margin:0 0 16px;color:#52525b;">${escapeHtml(name)}${role ? ` — ${escapeHtml(role)}` : ""} · ${escapeHtml(project)}</p>
  <p style="margin:0 0 12px;font-size:20px;color:#f59e0b;">${stars}</p>
  <p style="margin:0 0 20px;white-space:pre-wrap;">${escapeHtml(text)}</p>
  <p style="margin:0;color:#71717a;font-size:13px;">Approve it in /admin/reviews to show it on the site.</p>
</div>`,
    });
  } catch (err) {
    console.error(`Review form: notification email failed (${mailErrorCode(err)}).`, err);
  }

  return NextResponse.json({ ok: true });
}
