"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = { onSelect: (id: string) => void; onExplore: () => void; loading: boolean; unavailable: boolean };
const PLACES = [
  { id: "about", name: "The maker’s studio", detail: "Meet medevsmaker", x: 34, y: 57 },
  { id: "reelstyles", name: "ReelStyles", detail: "Tools for moving ideas", x: 62, y: 48 },
  { id: "mentorclone", name: "MentorClone", detail: "A little knowledge, on demand", x: 77, y: 57 },
  { id: "talkthedoc", name: "TalkTheDoc", detail: "Conversations with your documents", x: 71, y: 64 },
];

export function FarmPanorama({ onSelect, onExplore, loading, unavailable }: Props) {
  const [selected, setSelected] = useState(0);
  const futurePlaces = [
    { name: "The gathering place", detail: "Future meetups & shared tables", href: "/gather#meetups", x: 32, y: 41 },
    { name: "Stay a little", detail: "A future welcome for visitors", href: "/gather#visiting", x: 78, y: 36 },
  ];
  return <section className="atlas-panorama" aria-label="Explore the Middle Atlas farm">
    <div className="atlas-photo-wrap">
      <Image className="atlas-photo" src="/farm/atlas-homestead.webp" alt="An imagined Middle Atlas homestead with earthen courtyard buildings, an apple orchard, irrigation channel, sheep and cedar-covered foothills" fill priority sizes="100vw" quality={90} />
      <div className="atlas-shade" />
      <div className="atlas-hotspots" aria-label="Places and projects">
        {futurePlaces.map(place => <Link key={place.href} className="atlas-pin atlas-future-pin" style={{left: `${place.x}%`, top: `${place.y}%`}} href={place.href} aria-label={`${place.name}: ${place.detail}`}><span className="atlas-pin-dot"><span /></span><span className="atlas-pin-label">{place.name}<small>{place.detail}</small></span></Link>)}
        {PLACES.map((place, index) => <button key={place.id} className={`atlas-pin${selected === index ? " is-selected" : ""}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} onClick={() => { setSelected(index); onSelect(place.id); }} aria-label={`${place.name}: ${place.detail}`}>
          <span className="atlas-pin-dot"><span /></span><span className="atlas-pin-label">{place.name}<small>{place.detail}</small></span>
        </button>)}
      </div>
    </div>
    <div className="atlas-intro">
      <p className="atlas-eyebrow"><span /> A maker’s little corner of Morocco</p>
      <h2>Rooted here.<br /><em>Building everywhere.</em></h2>
      <p className="atlas-description">A home for making. A farm for gathering. Software, shared tables, and a future welcome in the Middle Atlas.</p>
      <div className="atlas-cta-row"><button className="atlas-primary" onClick={() => onSelect("reelstyles")}>Explore the work <span aria-hidden="true">↗</span></button><button className="atlas-secondary" onClick={onExplore} disabled={loading}>{loading ? "Opening the 3D world…" : unavailable ? "Retry the 3D farm" : "Enter the 3D farm"} <span aria-hidden="true">→</span></button></div>
      <p className="atlas-support" role="status">{unavailable ? "The 3D world couldn’t start here. Retry it, or explore every project below." : "Choose a place in the landscape to discover what’s inside."}</p>
    </div>
    <div className="atlas-mobile-places" aria-label="Explore projects">{PLACES.map(place => <button key={place.id} onClick={() => onSelect(place.id)}>{place.name} <span aria-hidden="true">↗</span></button>)}</div>
    <Link href="/gather" className="atlas-community-link">A place to gather <span>Meetups · future visits · community ↗</span></Link>
    <div className="atlas-caption"><span>IFRANE · AZROU · MIDELT</span><span>Imagined farm · inspired by a real place <a href="/references">View the references ↗</a></span></div>
  </section>;
}
