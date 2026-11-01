"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { copyChapterLink } from "@/farm/game/share-link";
import { TOUR_STOPS, tourPath } from "@/farm/game/tour";

export function TourStory({ index, onStep, onWaypoint, onWalk, onHelp, ready }: {
  index: number; onStep: (index: number) => void; onWaypoint: () => void; onWalk: () => void; onHelp: () => void; ready: boolean;
}) {
  const stop = TOUR_STOPS[index];
  const [shared, setShared] = useState("");
  const shareRequest = useRef(0);
  useEffect(() => () => { shareRequest.current++; }, []);
  async function share() {
    const request = ++shareRequest.current;
    setShared("Copying chapter link…");
    const copied = await copyChapterLink(() => navigator.clipboard.writeText(`${window.location.origin}${tourPath(index)}`));
    if (request === shareRequest.current) setShared(copied ? "Chapter link copied." : "Clipboard unavailable. Use the chapter link below to copy or open this view.");
  }
  function step(next: number) { shareRequest.current++; setShared(""); onStep(next); }
  return <div className="tour-story">
    <figure><Image src={stop.image} alt={stop.alt} width={800} height={450} sizes="(max-width: 600px) 90vw, 420px" /><figcaption>{stop.credit}{stop.credit.startsWith("Regional") && <> · <a href="/references">Credits & sources</a></>}</figcaption></figure>
    <div className="tour-copy" aria-live="polite" aria-atomic="true"><p className="tour-chapter">{stop.chapter}</p><h3>{stop.title}</h3><p>{stop.text}</p></div>
    <nav className="tour-chapters" aria-label="Tour chapters">{TOUR_STOPS.map((chapter, i) => <button key={chapter.id} aria-label={`Chapter ${i + 1}: ${chapter.chapter.split(" / ")[1]}`} aria-current={i === index ? "step" : undefined} onClick={() => step(i)}>{String(i + 1).padStart(2, "0")}</button>)}</nav>
    <div className="tour-pagination"><button disabled={index === 0} onClick={() => step(index - 1)}>Previous</button><span>{index + 1} / {TOUR_STOPS.length}</span><button disabled={index === TOUR_STOPS.length - 1} onClick={() => step(index + 1)}>Next chapter →</button></div>
    <div className="tour-actions"><a href={stop.href}>{stop.action} ↗</a><button onClick={() => { shareRequest.current++; onWaypoint(); setShared(`Waypoint set: ${stop.title}`); }}>Set a waypoint</button><button disabled={!ready} onClick={onWalk}>Walk here</button>{index === TOUR_STOPS.length - 1 && <button onClick={onHelp}>Help build the farm</button>}</div>
    {!ready && <p className="game-muted">The story is available here. Walking and cinematic views need the running 3D world.</p>}
    <div className="tour-share"><button onClick={() => void share()}>Copy chapter link</button><a href={tourPath(index)}>Open this chapter</a></div><p className="tour-status" role="status">{shared}</p>
  </div>;
}
