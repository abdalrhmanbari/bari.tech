import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#151515",
          color: "#F5F5F5",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "20px",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#888888",
          }}
        >
          <div style={{ width: "40px", height: "1px", background: "#353535" }} />
          Frontend Developer / Software Engineer
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "104px",
              fontWeight: 700,
              lineHeight: 1.03,
              letterSpacing: "-0.01em",
            }}
          >
            <span>Abd Alrhman</span>
            <span>Al Bari</span>
          </div>
          <div
            style={{
              fontSize: "30px",
              color: "#BDBDBD",
              maxWidth: "760px",
              lineHeight: 1.4,
            }}
          >
            Building fast, responsive web experiences with React, Next.js, and
            TypeScript.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "22px",
            letterSpacing: "0.08em",
            color: "#888888",
            borderTop: "1px solid #353535",
            paddingTop: "28px",
          }}
        >
          <span>React · Next.js · TypeScript · Headless WordPress</span>
          <span>{new URL(site.socials.github).host}/abdalrhmanbari</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
