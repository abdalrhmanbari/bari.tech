import type { LiveBatch, LiveFrame } from "./live-types";

/** How often an idle tab asks whether the admin opened a live view of it. */
const WATCH_CHECK_MS = 8_000;
/** While watched, frames are sent this often. */
const SEND_MS = 1_000;
/** Pointer moves are sampled at most this often (~20 fps). */
const MOVE_SAMPLE_MS = 50;
const SCROLL_SAMPLE_MS = 100;

function post(body: object): Promise<{ watched?: boolean }> {
  return fetch("/api/visits", { method: "POST", body: JSON.stringify(body) }).then((res) => res.json());
}

/** Short, non-sensitive description of a click target: the link/button text, never field contents. */
function clickLabel(target: EventTarget | null): string | undefined {
  const el = (target as Element | null)?.closest?.("a, button, [role=button], input, textarea, select, label");
  if (!el) return undefined;
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    return `field ${fieldName(el)}`;
  }
  const text = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 60) : undefined;
}

function fieldName(el: Element): string {
  return el.getAttribute("name") || el.id || el.tagName.toLowerCase();
}

/**
 * Captures pointer/scroll/focus activity into frames and sends them once a
 * second, until the server says nobody is watching any more. Typed text is
 * never captured — only which field is being typed in.
 */
function stream(id: string, onStop: () => void): () => void {
  let frames: LiveFrame[] = [];
  let lastMove = 0;
  let lastScroll = 0;
  let typingIn: string | null = null;
  let stopped = false;

  const push = (frame: Omit<LiveFrame, "t">) => frames.push({ t: Date.now(), ...frame });
  push({ k: "s", y: Math.round(window.scrollY) });

  function onPointerMove(e: PointerEvent) {
    if (e.timeStamp - lastMove < MOVE_SAMPLE_MS) return;
    lastMove = e.timeStamp;
    push({ k: "m", x: e.clientX, y: e.clientY });
  }
  function onPointerDown(e: PointerEvent) {
    push({ k: "c", x: e.clientX, y: e.clientY, label: clickLabel(e.target) });
  }
  function onScroll() {
    const now = performance.now();
    if (now - lastScroll < SCROLL_SAMPLE_MS) return;
    lastScroll = now;
    push({ k: "s", y: Math.round(window.scrollY) });
  }
  function onFocusIn(e: FocusEvent) {
    const el = e.target as Element | null;
    if (el?.matches?.("input, textarea, select")) push({ k: "f", label: fieldName(el) });
  }
  function onInput(e: Event) {
    const name = fieldName(e.target as Element);
    if (name === typingIn) return; // one "typing" frame per field per batch is enough
    typingIn = name;
    push({ k: "i", label: name });
  }

  const opts = { passive: true, capture: true } as const;
  window.addEventListener("pointermove", onPointerMove, opts);
  window.addEventListener("pointerdown", onPointerDown, opts);
  window.addEventListener("scroll", onScroll, opts);
  document.addEventListener("focusin", onFocusIn, true);
  document.addEventListener("input", onInput, true);

  async function send() {
    if (stopped) return;
    // Trailing scroll position, so a fast flick doesn't end between samples.
    push({ k: "s", y: Math.round(window.scrollY) });
    const batch: LiveBatch = {
      seq: Date.now(),
      path: window.location.pathname,
      lang: document.documentElement.lang === "ar" ? "ar" : "en",
      vw: window.innerWidth,
      vh: window.innerHeight,
      frames,
    };
    frames = [];
    typingIn = null;
    try {
      const { watched } = await post({ action: "live", id, batch });
      if (!watched) stop();
    } catch {
      // Dropped second — keep going.
    }
  }

  const timer = window.setInterval(send, SEND_MS);

  function stop() {
    if (stopped) return;
    stopped = true;
    window.clearInterval(timer);
    window.removeEventListener("pointermove", onPointerMove, opts);
    window.removeEventListener("pointerdown", onPointerDown, opts);
    window.removeEventListener("scroll", onScroll, opts);
    document.removeEventListener("focusin", onFocusIn, true);
    document.removeEventListener("input", onInput, true);
    onStop();
  }

  return stop;
}

/**
 * Lets the admin's live view attach to this tab. Idle cost is one tiny
 * request every WATCH_CHECK_MS while the tab is visible; streaming only
 * starts after the admin opens "Watch live" for this visit. Returns a cleanup.
 */
export function enableLiveView(id: string): () => void {
  let stopStream: (() => void) | null = null;
  let disposed = false;

  async function check() {
    if (disposed || stopStream || document.visibilityState !== "visible") return;
    try {
      const { watched } = await post({ action: "watch-check", id });
      if (watched && !disposed && !stopStream) {
        stopStream = stream(id, () => {
          stopStream = null;
        });
      }
    } catch {
      // Best-effort.
    }
  }

  check();
  const timer = window.setInterval(check, WATCH_CHECK_MS);

  return () => {
    disposed = true;
    window.clearInterval(timer);
    stopStream?.();
  };
}
