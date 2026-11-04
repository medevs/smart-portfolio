import Image from "next/image";
import Link from "next/link";

/** Shown whenever the 3D farm cannot run: no WebGL, lost context, scene or shader error. */
export function FarmFallback() {
  return (
    <section className="farm-fallback" role="status" aria-labelledby="farm-fallback-title">
      <Image
        className="farm-fallback-image"
        src="/farm/atlas-homestead.webp"
        alt="An imagined Middle Atlas homestead with earthen courtyard buildings, an apple orchard, irrigation channel, sheep and cedar-covered foothills"
        width={640}
        height={360}
        sizes="(max-width: 640px) 90vw, 560px"
        priority
      />
      <h2 id="farm-fallback-title">The 3D farm couldn’t start on this device</h2>
      <p>
        This site is a playable 3D farm in the Middle Atlas of Morocco, where medevsmaker shows
        software projects and builds 3D walkthroughs for others. Everything on it is also available
        as a plain list.
      </p>
      <div className="farm-fallback-links">
        <Link className="farm-fallback-primary" href="/list">
          Explore all places in list view →
        </Link>
        <Link href="/impressum">Contact the maker</Link>
      </div>
    </section>
  );
}
