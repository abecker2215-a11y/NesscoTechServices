import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Nessco Tech Services | Local IT Help Without the IT-Speak";

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
          padding: 72,
          background: "linear-gradient(135deg, #0b1020 0%, #0f172a 55%, #0c4a6e 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#0ea5e9",
              color: "#ffffff",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, fontWeight: 700 }}>Nessco Tech Services</div>
            <div style={{ fontSize: 24, color: "#94a3b8" }}>Tampa Bay Area, FL</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, maxWidth: 950 }}>
            Local IT Help Without the IT-Speak
          </div>
          <div style={{ fontSize: 32, color: "#38bdf8", fontWeight: 600 }}>
            Starting at $75 • Remote &amp; On-Site • Mon–Fri 8am–6pm
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#e2e8f0" }}>
            nesscotech.com
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 28px",
              borderRadius: 9999,
              background: "#0ea5e9",
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            nesscotech.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
