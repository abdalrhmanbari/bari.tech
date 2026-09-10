import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>Designed &amp; Built by {site.name}</div>
      <div>© {new Date().getFullYear()}</div>
    </footer>
  );
}
