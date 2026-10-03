"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { track } from "@/lib/visits/track";
import { isVitalMetric } from "@/lib/visits/events";
import { isLiveView } from "@/lib/visits/live-types";

/** Names a link by where it goes, independent of its (translated) label. */
function linkTarget(anchor: HTMLAnchorElement): string | null {
  const href = anchor.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("#")) return href.length > 1 ? `nav:${href.slice(1)}` : null;

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (anchor.hasAttribute("download") || /\.pdf$/i.test(url.pathname)) {
    return `download:${url.pathname.split("/").pop()}`;
  }
  if (url.origin === window.location.origin) {
    if (url.pathname === window.location.pathname && url.hash) return `nav:${url.hash.slice(1)}`;
    return url.pathname === "/" ? "home" : url.pathname.slice(1);
  }
  if (host === "wa.me" || host.endsWith("whatsapp.com")) return "whatsapp";
  if (host.endsWith("linkedin.com")) return "linkedin";
  if (host.endsWith("github.com")) return "github";
  return host;
}

/** The page area a click came from: the enclosing section's id, or header/footer. */
function clickArea(element: Element): string {
  const area = element.closest("section[id], header, footer");
  if (!area) return "page";
  return area.tagName === "SECTION" ? area.id : area.tagName.toLowerCase();
}

/**
 * Reports what visitors do on the page — which sections they reach, which
 * links and buttons they use, which forms they start — plus real-user Web
 * Vitals, through `track()`. Project cards and forms report their own
 * views/submissions. Renders nothing.
 */
export function EngagementTracker() {
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    if (isVitalMetric(metric.name) && !isLiveView()) track(`vital:${metric.name}`, metric.value);
  });

  // Sections reached: counted once a section's top crosses into the upper 60% of the viewport.
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    if (!sections.length || typeof IntersectionObserver === "undefined" || isLiveView()) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          track(`section:${entry.target.id}`);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  // Link clicks, delegated so no link needs wiring. Project links are named after their project.
  useEffect(() => {
    if (isLiveView()) return;
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const target = linkTarget(anchor);
      if (!target) return;
      const project = anchor.closest<HTMLElement>("[data-project]")?.dataset.project;
      track(project ? `project_link:${project}` : `click:${target}@${clickArea(anchor)}`);
    }

    // First interaction with a form marked `data-track-form`.
    function onFocusIn(event: FocusEvent) {
      const form = (event.target as Element | null)?.closest?.<HTMLFormElement>("form[data-track-form]");
      if (form) track(`form_start:${form.dataset.trackForm}`);
    }

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  return null;
}
