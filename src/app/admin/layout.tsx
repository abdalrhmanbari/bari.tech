import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

// globals.css sets `font-family: var(--font-inter)`; without this the variable
// is undefined here and the whole dashboard falls back to the browser's serif.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin · Content Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={inter.variable}>
      <body className="min-h-screen bg-bg-primary text-ink-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
