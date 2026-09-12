# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server, http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint (next/core-web-vitals + next/typescript)
npm run typecheck  # tsc --noEmit
```

There is no test runner configured in this repo. Some `/admin` features (see below) require Netlify's runtime and won't work under plain `next dev` — use `netlify dev` instead when working on those.

## Stack

Next.js 15 (App Router) + TypeScript, Tailwind CSS, Framer Motion, Lenis (smooth scroll), Lucide React icons. Path alias `@/*` → `src/*`.

## Architecture

### Content pipeline: data files → i18n dictionaries → CMS overrides

Content flows through three layers, and understanding the layering matters before editing any copy:

1. **`src/data/*.ts`** (`site.ts`, `about.ts`, `services.ts`, `projects.ts`, `experience.ts`, `tech-stack.ts`, `faq.ts`, `contact.ts`) — the single-sourced English content. Editing these is the correct way to change baseline English copy.
2. **`src/data/i18n/en.ts`** imports from those same `src/data/*.ts` files and composes them into a `Dictionary`, adding only the UI chrome strings (eyebrows, button/form labels, aria labels) that don't belong in the data files. **`src/data/i18n/ar.ts`** is authored independently as a full parallel `Dictionary` (not derived from the data files). Both conform to the shared shape in `src/data/i18n/types.ts`. When adding a new field to `Dictionary`, it must be filled in both `en.ts` and `ar.ts`.
3. **Netlify Blobs overrides** (`src/lib/content/store.ts`) — content edited live through `/admin` is persisted per-language in a Netlify Blobs store (`cms-content`) and merged on top of the static dictionaries at request time by `src/lib/content/merge.ts` (`getMergedDictionaries`). Only the subset of fields defined in `ContentOverride` (`src/lib/content/schema.ts`) is editable this way — UI chrome is intentionally excluded, only real content sections (hero, about, services, projects, experience, techStack, faq, contact).

Because content can change at runtime via `/admin`, the root layout (`src/app/(site)/layout.tsx`) sets `export const dynamic = "force-dynamic"` — pages are never statically cached.

### Admin dashboard (`/admin`)

- Single shared password (`ADMIN_PASSWORD` env var), no per-user accounts.
- `src/middleware.ts` gates `/admin/:path*` and `/api/admin/:path*`, checking a signed session cookie (`admin_session`) via `src/lib/admin/auth.ts`. Sessions are HMAC-SHA256 tokens (`expiry.signature`) built with Web Crypto so the same code runs in Edge middleware and API routes — there is no server-side session store.
- `src/lib/admin/section-config.ts` declaratively describes the edit form for each section (`text` / `list` / `repeater` blocks), including optional `toRow`/`fromRow` transforms for sections whose stored shape doesn't map 1:1 to flat form fields (e.g. `projects.items[].links[0]` ↔ a single link-label/link-href pair, or comma-separated strings ↔ arrays). `SectionEditor` (`src/app/admin/(dashboard)/[section]/page.tsx`) renders forms generically from this config — add a new editable field by extending `ContentOverride` + `SECTION_CONFIGS` together, not by hand-writing a new form.
- `PUT /api/admin/content` reads the current override, shallow-merges in the edited section, and writes the whole override object back for that language; `GET` returns the effective (merged) content for prefilling forms.

### i18n / RTL

- `LanguageProvider` (`src/components/i18n/LanguageProvider.tsx`) is a client context holding `lang`/`dict`, seeded from `localStorage` (`lang` key) and defaulting to English so SSR and first client render agree.
- A tiny inline boot script (`src/components/i18n/langBoot.ts`, injected in the root layout) sets `<html lang/dir>` from `localStorage` before paint, to avoid an RTL/LTR flash — this duplicates (deliberately) the effect `LanguageProvider` runs after mount.
- Arabic swaps in a different font family via the `:root[lang="ar"]` rule in `globals.css` plus the `arabic` Tailwind font family (`tailwind.config.ts`), layered on top of `font-sans`/`font-serif`/`font-grotesk`.

### Design tokens & responsive breakpoints

Colors, spacing (`header`), and named breakpoints (`bp-xl` down to `bp-2xs`, all `max-width` queries matching the original reference site's media queries) are defined once in `tailwind.config.ts` and consumed as Tailwind utilities everywhere — don't hardcode hex colors or pixel breakpoints in components.

### Contact form

`src/app/api/contact/route.ts` sends mail via Gmail SMTP (`nodemailer`, requires `runtime = "nodejs"` since nodemailer can't run on Edge; also excluded from bundling via `serverExternalPackages` in `next.config.mjs`). Requires `GMAIL_USER` + `GMAIL_APP_PASSWORD` env vars; delivers to `CONTACT_TO` (defaults to `GMAIL_USER`). Includes a honeypot field (`company`) and basic server-side validation. `NEXT_PUBLIC_CONTACT_ENDPOINT` can redirect the form to an external endpoint (e.g. Formspree) instead of this route.

## Environment variables

Copy `.env.example` to `.env.local`. Key variables: `NEXT_PUBLIC_SITE_URL` (canonical origin for metadata/sitemap/OG), `GMAIL_USER`/`GMAIL_APP_PASSWORD`/`CONTACT_TO` (contact form SMTP), `NEXT_PUBLIC_CONTACT_ENDPOINT` (optional external form target), `ADMIN_PASSWORD` (required to use `/admin`; the dashboard only functions against real Netlify Blobs storage, i.e. deployed on Netlify or run via `netlify dev`).

## Accessibility & motion

- Respects `prefers-reduced-motion` — Lenis smooth scroll, the custom cursor, and transitions all stand down (see `useReducedMotionSafe` hook).
- Custom cursor (`CustomCursor`) only mounts for fine pointers on wide viewports.
- Semantic landmarks, skip link, full keyboard support, visible focus rings, `aria-*` on the mobile menu and form status.
