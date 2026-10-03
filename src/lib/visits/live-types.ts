/**
 * Wire format for the admin's "Watch live" view. While an admin is watching a
 * visitor, that visitor's tab sends one LiveBatch about every second; the
 * dashboard replays the frames over a copy of the same page.
 */

/** Query param that puts a site page into "live view" mode (used by the admin's iframe). */
export const LIVE_VIEW_PARAM = "live-view";

export type LiveFrame = {
  /** Visitor's clock, ms since epoch. Only differences between frames matter. */
  t: number;
  /** m = pointer move, c = click/tap, s = scroll, f = focused a form field, i = typing in a field. */
  k: "m" | "c" | "s" | "f" | "i";
  /** Viewport (client) coordinates for m/c; scrollY for s. */
  x?: number;
  y?: number;
  /** c: short label of what was clicked; f/i: the field's name. Never what was typed. */
  label?: string;
};

export type LiveBatch = {
  /** Visitor's clock when the batch was sent — increases across reloads, unlike a counter. */
  seq: number;
  path: string;
  lang: "en" | "ar";
  /** Visitor's viewport size in CSS px, so the dashboard can render the page at the same width. */
  vw: number;
  vh: number;
  frames: LiveFrame[];
};

export const LIVE_FRAME_KINDS = ["m", "c", "s", "f", "i"] as const;

/** True when the current page was opened by the admin's live viewer (never tracked). */
export function isLiveView(): boolean {
  return typeof window !== "undefined" && new URLSearchParams(window.location.search).has(LIVE_VIEW_PARAM);
}
