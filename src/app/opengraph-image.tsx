import { ImageResponse } from "next/og";

export const alt = "medevsmaker — a farm you can wander";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "linear-gradient(180deg, #3c3494 0%, #c86aad 42%, #ff8a5c 72%, #ffc56e 100%)",
          padding: 64,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 70, right: 90, width: 90, height: 90, borderRadius: 45, background: "#ffe08a" }} />
        <div style={{ display: "flex", position: "absolute", left: 0, right: 0, bottom: 0, height: 180, background: "#2f7d3e" }} />
        <div style={{ display: "flex", position: "absolute", left: 80, bottom: 150, width: 70, height: 120, background: "#1f9a8e", borderRadius: 40 }} />
        <div style={{ display: "flex", position: "absolute", left: 150, bottom: 160, width: 64, height: 100, background: "#f4a0be", borderRadius: 36 }} />
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 430,
            bottom: 150,
            width: 280,
            height: 180,
            background: "#e1534a",
            border: "8px solid #4a3428",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 400,
            bottom: 310,
            width: 340,
            height: 90,
            background: "#7e2c2a",
          }}
        />
        <div style={{ display: "flex", position: "absolute", left: 760, bottom: 150, width: 90, height: 250, background: "#f3ecdf", border: "6px solid #4a3428" }} />
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ fontSize: 72, color: "#fffaf3", fontWeight: 700 }}>medevsmaker</div>
          <div style={{ fontSize: 32, color: "#fff4e4", marginTop: 8 }}>a farm you can wander</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
