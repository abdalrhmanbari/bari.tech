/**
 * Shared, framework-neutral bits for the language toggle. Kept out of the
 * `"use client"` provider module so the server layout can import the boot
 * script without pulling a client component into the server graph.
 */

export const LANG_STORAGE_KEY = "lang";

/**
 * Runs before paint (injected by the root layout) so `<html dir>` is correct
 * on the first frame — no RTL/LTR flash. Mirrors the effect in
 * `LanguageProvider`.
 */
export const LANG_BOOT_SCRIPT = `(function(){try{var l=localStorage.getItem(${JSON.stringify(
  LANG_STORAGE_KEY,
)});if(l==="ar"){var e=document.documentElement;e.setAttribute("lang","ar");e.setAttribute("dir","rtl");}}catch(e){}})();`;
