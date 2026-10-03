/**
 * Shared, framework-neutral bits for the language toggle. Kept out of the
 * `"use client"` provider module so the server layout can import the boot
 * script without pulling a client component into the server graph.
 */

import { LIVE_VIEW_PARAM } from "@/lib/visits/live-types";

export const LANG_STORAGE_KEY = "lang";

/**
 * In the admin's live view (`?live-view`), the page
 * shows the watched visitor's language from `?lang=` and must not overwrite
 * the admin's own stored preference.
 */
export function liveViewLang(): "en" | "ar" | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (!params.has(LIVE_VIEW_PARAM)) return null;
  return params.get("lang") === "ar" ? "ar" : "en";
}

/**
 * Runs before paint (injected by the root layout) so `<html dir>` is correct
 * on the first frame — no RTL/LTR flash. Mirrors the effect in
 * `LanguageProvider`.
 */
export const LANG_BOOT_SCRIPT = `(function(){try{var p=new URLSearchParams(location.search);var l=p.has(${JSON.stringify(LIVE_VIEW_PARAM)})?p.get("lang"):localStorage.getItem(${JSON.stringify(
  LANG_STORAGE_KEY,
)});if(l==="ar"){var e=document.documentElement;e.setAttribute("lang","ar");e.setAttribute("dir","rtl");}}catch(e){}})();`;
