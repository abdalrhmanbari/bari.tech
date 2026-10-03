import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/** Loads Google Analytics 4 (gtag.js). Renders nothing when no Measurement ID is configured. */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // Pages opened by the admin's live viewer aren't real visits.
          if (location.search.indexOf('live-view') < 0) gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
