import { offerings } from "@/config/shop";
import { items } from "@/farm/items";
import { ImageResponse } from "next/og";

export const alt = "A spot on medevsmaker's farm";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function SpotImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = items.find((entry) => entry.id === id);
  const offering = offerings.find((entry) => entry.id === id);
  const title = item?.name || offering?.title || "A spot on the farm";
  const line = item?.pitch || offering?.blurb || "Come see it on the farm.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #3c3494, #e56a8a 55%, #ffc56e)",
          padding: 72,
          color: "#fffaf3",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2 }}>medevsmaker · the farm</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1 }}>{title}</div>
          <div style={{ fontSize: 30, marginTop: 18, maxWidth: 900 }}>{line}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
