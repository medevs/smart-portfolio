import Image from "next/image";
import Link from "next/link";
import references from "@/data/morocco-references.json";

export const metadata = { title: "Middle Atlas reference photographs" };

export default function ReferencesPage() {
  return <main style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 24px 100px", color: "#eae2d3" }}>
    <Link href="/">← Back to the farm</Link>
    <p style={{ marginTop: 48, textTransform: "uppercase", letterSpacing: ".18em", color: "#c6ab78" }}>Ifrane · Azrou · Midelt</p>
    <h1 style={{ fontSize: "clamp(32px,5vw,58px)", fontFamily: "var(--font-fraunces)", margin: "16px 0" }}>A place to come home to.</h1>
    <p style={{ maxWidth: 680, fontSize: 18, lineHeight: 1.8, marginBottom: 40 }}>Real photographs behind the farm’s direction: the cedar country around Azrou, the Ifrane plateau, earthen walls, orchards, and Jbel Ayachi above Midelt. The world is an interpretation of this region, rather than a reconstruction of one property.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
      {references.map(photo => <figure key={photo.source} style={{ margin: 0, background: "#252c26", borderRadius: 12, overflow: "hidden" }}>
        <Image src={photo.image} alt={photo.title.replace(/\.(jpg|jpeg)$/i, "")} width={640} height={440} style={{ width: "100%", height: 240, objectFit: "cover" }} />
        <figcaption style={{ padding: 20, lineHeight: 1.6 }}><a href={photo.source} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>{photo.title.replace(/\.(jpg|jpeg)$/i, "")}</a><br /><small>{photo.author} · {photo.license}</small><br /><small>Wikimedia Commons. Resized for display; photograph otherwise unchanged. License and full details at source.</small></figcaption>
      </figure>)}
    </div>
  </main>;
}
