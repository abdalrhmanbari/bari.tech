import { notFound } from "next/navigation";

/**
 * Catches every URL no other route matches, so unknown paths render the
 * site's own 404 (`../not-found.tsx`) inside the site layout — with this app's
 * two root layouts there is no top-level `app/not-found.tsx` to fall back on.
 */
export default function MissingPage() {
  notFound();
}
