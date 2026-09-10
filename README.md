# Abd Alrhman Al Bari — Portfolio

Personal portfolio for **Abd Alrhman Al Bari**, Frontend Developer / Software Engineer.
Dark, minimal, "machined" design language with momentum scrolling, masked hero
reveals, scroll-triggered entrances, a pointer-follow cursor, and 3D card tilt.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** for layout utilities; design tokens live in `globals.css` + `tailwind.config.ts`
- **Framer Motion** for entrance / scroll / hover animation
- **Lenis** for smooth momentum scrolling
- **Lucide React** for icons

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Configuration

Copy `.env.example` to `.env.local` and set:

| Variable                       | Purpose                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`         | Canonical origin used for metadata, canonical URL, sitemap, and Open Graph.             |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Optional POST endpoint for the contact form. When empty the form falls back to `mailto:`. |

## Editing content

All copy is data-driven — no content is hardcoded inside components:

| File                      | Controls                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `src/data/site.ts`        | Name, role, hero copy, logo, email, socials, nav, SEO strings  |
| `src/data/about.ts`       | About heading, paragraphs, stat facts                          |
| `src/data/projects.ts`    | Project cards (title, tag, description, tech tags, links)       |
| `src/data/experience.ts`  | Timeline entries                                               |
| `src/data/tech-stack.ts`  | Skill groups                                                   |
| `src/data/education.ts`   | Education cards                                                 |
| `src/data/contact.ts`     | Contact heading, blurb, direct links                           |

### Swapping the portrait

`public/portrait.svg` is a placeholder. Drop a real photo in `public/` (e.g.
`portrait.jpg`) and update the `src` in `src/components/sections/Hero.tsx`.
`next/image` will optimise raster formats automatically.

## Structure

```
src/
  app/            layout, page, metadata routes (sitemap, robots, manifest, OG image, icon)
  components/
    layout/       Header, Footer, SmoothScroll, CustomCursor, Overlays
    sections/     Hero, About, Projects, Experience, TechStack, Education, Contact
    ui/           Eyebrow, Reveal, ProjectCard, ContactForm
  data/           all editable content
  hooks/          useTilt
  lib/            motion presets, cn helper
```

## Accessibility & performance

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`, `article`), skip link
- Full keyboard support; visible focus rings; `aria-*` on the mobile menu and form status
- Respects `prefers-reduced-motion` — Lenis, the custom cursor, and transitions all stand down
- Custom cursor only mounts for fine pointers on wide viewports
- Fonts via `next/font` (self-hosted, `display: swap`); hero image uses `next/image` with `priority`
