"use client";
import { useState } from "react";
import { LESSONS } from "@/farm/game/tutorial";

/** Original field-book diagrams explain controls rather than pretending to be gameplay screenshots. */
export function LessonDrawing({kind}:{kind:typeof LESSONS[number]["diagram"]}) {
  return <svg className="lesson-drawing" viewBox="0 0 540 220" role="img" aria-label={{move:"Movement keys and a walking path",map:"Compass, waypoint and the path through the farm",water:"A well, watering can and garden bed",apple:"Three low apples, picked one at a time into a basket",load:"Walk to the back of the stopped trailer to load",drive:"The tractor pulls its hinged trailer along the path",table:"Unload the basket, then carry it to the shared table"}[kind]}>
    <defs><pattern id={`paper-${kind}`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 24H24" stroke="#807b5f" strokeOpacity=".07"/></pattern><marker id={`arrow-${kind}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#8d6541" strokeWidth="1.5"/></marker></defs>
    <rect width="540" height="220" fill={`url(#paper-${kind})`}/>
    <g fill="none" stroke="#53604c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {(kind==="move"||kind==="map")&&<>
        <path d="M145 190Q170 150 215 145T302 91Q347 58 403 57" stroke="#a79773" strokeWidth="24" opacity=".35"/>
        <path d="M145 190Q170 150 215 145T302 91Q347 58 403 57" stroke="#8d6541" strokeDasharray="4 9" markerEnd={`url(#arrow-${kind})`}/>
        <path d="M353 55V18H411V55M344 18H420M365 55V36H380V55"/><path d="M441 90V41M430 56L441 41L452 56"/>
        <text x="435" y="30" stroke="none" fill="#53604c" fontSize="15">N</text>
        {kind==="move"?<g transform="translate(48 72)">{[['W',48,0],['A',0,48],['S',48,48],['D',96,48]].map(([letter,x,y])=><g key={letter} transform={`translate(${x} ${y})`}><rect width="39" height="39" rx="5" fill="#f7f3e9"/><text x="19.5" y="26" textAnchor="middle" stroke="none" fill="#394933" fontSize="18">{letter}</text></g>)}</g>:<><circle cx="105" cy="104" r="43" stroke="#a79c7c"/><path d="M105 66L96 110L105 102L114 110Z" fill="#68765b"/><text x="68" y="169" stroke="none" fill="#53604c" fontSize="14">Map · M</text></>}
        <circle cx="205" cy="145" r="7" fill="#68765b"/><circle cx="405" cy="57" r="9" stroke="#b08650"/>
      </>}
      {kind==="water"&&<>
        <ellipse cx="104" cy="126" rx="42" ry="15"/><path d="M62 126V167Q104 190 146 167V126M58 117V57H150V117M88 61V122M122 61V122"/>
        <path d="M224 124V168Q243 179 262 168V124ZM262 136L297 113L303 122L263 154M223 132C199 120 200 166 222 163M231 123Q243 106 256 123"/>
        <path d="M327 176H484L465 145H344ZM357 148V117M386 149V105M416 149V114M447 149V105M357 131Q341 128 346 118M386 120Q406 114 399 104M416 130Q430 122 429 116M447 121Q430 115 436 107"/>
        <path d="M168 145H202M279 157L322 159" stroke="#8d6541" markerEnd={`url(#arrow-${kind})`}/>
      </>}
      {kind==="apple"&&<>
        <path d="M119 188L124 99L105 65M125 115L161 78L191 70M125 100L148 49M110 79L73 76M147 52L173 32" strokeWidth="7"/>
        <path d="M65 69Q37 22 91 28Q114 2 143 22Q181 5 193 45Q234 46 216 79Q201 98 170 89" stroke="#7b8966" strokeWidth="2"/>
        {[{x:78,y:88},{x:164,y:90},{x:193,y:77}].map((p,i)=><g key={i}><path d={`M${p.x} ${p.y-5}q-13 -10 -14 5q2 18 14 17q14 0 15 -17q-3 -13 -15 -5`} fill="#b77954" stroke="#8f6848"/><path d={`M${p.x} ${p.y-5}l4 -10`}/></g>)}
        <path d="M258 127Q305 97 345 131" stroke="#8d6541" strokeDasharray="5 7" markerEnd={`url(#arrow-${kind})`}/>
        <path d="M354 142L368 183Q403 197 439 183L453 142ZM367 155H440M371 166H437M382 145Q404 102 429 145"/>
        <text x="324" y="70" stroke="none" fill="#53604c" fontSize="17">One branch. One apple.</text>
      </>}
      {(kind==="load"||kind==="drive"||kind==="table")&&<>
        <g transform="translate(35 0)">
          <path d="M112 153V103H183V139H206V153ZM109 105H191M116 102V64H186V139M107 63H197M169 101V84"/>
          <circle cx="132" cy="155" r="27" fill="#e2dfcd"/><circle cx="132" cy="155" r="12"/><circle cx="191" cy="163" r="18" fill="#e2dfcd"/>
          <path d="M105 146L77 152L56 149M-22 119H65V155H-22ZM-22 132H65M-22 145H65"/><circle cx="17" cy="168" r="17" fill="#e2dfcd"/>
          <path d="M105 193H-36" stroke="#a79773" strokeWidth="5" opacity=".5"/>
        </g>
        {kind==="load"?<><path d="M410 133L418 163Q441 174 463 163L471 133ZM423 133Q441 103 458 133"/><path d="M395 155Q343 214 267 190L15 180" stroke="#8d6541" strokeDasharray="5 7" markerEnd={`url(#arrow-${kind})`}/><text x="326" y="70" stroke="none" fill="#53604c" fontSize="16">Stop. Walk to the rear.</text></>:kind==="drive"?<><path d="M253 162Q319 151 360 125T468 90" stroke="#8d6541" strokeDasharray="5 7" markerEnd={`url(#arrow-${kind})`}/><path d="M393 79V46H470V79M384 45H480"/><text x="284" y="28" stroke="none" fill="#53604c" fontSize="16">Steer while moving.</text></>:<><path d="M325 137H487M337 137V185M475 137V185M345 132L352 111H386L392 132M437 130V112H451V130"/><path d="M202 174Q257 207 315 165" stroke="#8d6541" strokeDasharray="5 7" markerEnd={`url(#arrow-${kind})`}/><text x="300" y="71" stroke="none" fill="#53604c" fontSize="16">Unload. Carry. Share.</text></>}
      </>}
    </g>
  </svg>;
}

export function TutorialBook({ready,onPractice}:{ready:boolean;onPractice:()=>void}) {
  const [chapter,setChapter]=useState(0),[device,setDevice]=useState<"keys"|"touch">("keys");
  const lesson=LESSONS[chapter];
  return <div className="tutorial-book">
    <div className="tutorial-book-intro"><span className="field-kicker">A visitor’s field guide</span><h3>A little help for the road.</h3><p>Read at your own pace, or follow the guided visit in the farm. You can stop the guide at any time.</p></div>
    <nav className="tutorial-chapters" aria-label="Tutorial lessons">{LESSONS.map((entry,i)=><button key={entry.id} aria-current={chapter===i?"step":undefined} onClick={()=>setChapter(i)}><span>{String(i+1).padStart(2,"0")}</span>{entry.title}</button>)}</nav>
    <section className="tutorial-page" aria-labelledby="lesson-title">
      <LessonDrawing kind={lesson.diagram}/>
      <p className="field-kicker">{lesson.eyebrow}</p><h4 id="lesson-title">{lesson.title}</h4><p>{lesson.body}</p>
      <div className="tutorial-device" aria-label="Choose control instructions"><button aria-pressed={device==="keys"} onClick={()=>setDevice("keys")}>Keyboard & mouse</button><button aria-pressed={device==="touch"} onClick={()=>setDevice("touch")}>Touch controls</button></div>
      <p className="lesson-controls"><span>{device==="keys"?"Controls":"On your screen"}</span>{lesson[device]}</p>
      <div className="tutorial-pagination"><button disabled={chapter===0} onClick={()=>setChapter(i=>i-1)}>← Previous</button><span>{chapter+1} / {LESSONS.length}</span><button disabled={chapter===LESSONS.length-1} onClick={()=>setChapter(i=>i+1)}>Next →</button></div>
    </section>
    <div className="tutorial-start"><div><strong>Try it in the farm</strong><p>Your existing journal stays with you.</p></div><button disabled={!ready} onClick={onPractice}>Start guided visit</button>{!ready&&<p className="game-muted">Guided practice needs the running 3D world. Every lesson is available to read here.</p>}</div>
  </div>;
}
