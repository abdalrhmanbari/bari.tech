"use client";

import { useState } from "react";
import { site, CONTACT_ENDPOINT } from "@/data/site";

type Status = "idle" | "submitting" | "success" | "error";

const MESSAGES: Record<Exclude<Status, "idle" | "submitting">, string> = {
  success: "Thanks — your message is on its way.",
  error: "Please fill in every field with a valid email address.",
};

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !message || !emailOk) {
      setStatus("error");
      return;
    }

    if (CONTACT_ENDPOINT) {
      try {
        setStatus("submitting");
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        });
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        setStatus("success");
      } catch {
        setStatus("error");
      }
      return;
    }

    // No endpoint configured — hand the draft to the visitor's mail client.
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="cf-name">Your Name</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className="form-field">
        <label htmlFor="cf-email">Email Address</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="cf-message">Project Details</label>
        <textarea
          id="cf-message"
          name="message"
          rows={6}
          placeholder="Tell me about your project..."
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>

      <p className="contact-status" role="status" aria-live="polite">
        {status === "success" && MESSAGES.success}
        {status === "error" && MESSAGES.error}
      </p>
    </form>
  );
}
