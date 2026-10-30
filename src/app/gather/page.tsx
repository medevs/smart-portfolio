import Image from "next/image";
import Link from "next/link";
import "./gather.css";

export const metadata = { title: "A place to gather", description: "The future vision for medevsmaker’s Middle Atlas farm: a home for making, meeting and welcoming curious visitors." };

const spaces = [
  { no: "01", id: "maker", title: "A studio for making.", text: "A little home base for medevsmaker: building software, sharing the process, and turning ideas into useful things. The work starts online. The dream has its roots here.", tag: "The maker", cta: "Follow the build", href: "https://x.com/medevsmaker" },
  { no: "02", id: "meetups", title: "Good people. One long table.", text: "A shaded courtyard for future maker meetups, small workshops, shared meals and conversations that run past sunset. A welcoming community for developers, independent makers and curious neighbours.", tag: "Future gatherings", cta: "See updates on X", href: "https://x.com/medevsmaker" },
  { no: "03", id: "visiting", title: "Stay a little. Be part of it.", text: "The vision is to welcome travellers and visitors into the rhythm of the farm: the orchard, the mountains, the work and the table. Simple guest spaces, time outdoors, and a chance to meet the people building it.", tag: "Future visits", cta: "Follow for visiting news", href: "https://x.com/medevsmaker" },
];

export default function GatherPage() {
  return <main className="gather-page">
    <header className="gather-nav"><Link href="/" className="gather-wordmark">medevsmaker</Link><Link href="/">Back to the farm ↗</Link></header>
    <section className="gather-hero">
      <Image src="/farm/atlas-homestead.webp" fill priority alt="An imagined future Middle Atlas farm with a home, studio, gathering pavilion and guest spaces" sizes="100vw" />
      <div className="gather-hero-shade" />
      <div><p className="gather-kicker">A home for ideas. A place for people.</p><h1>Some things grow<br /><em>better together.</em></h1><p>A future farm, gathering place, and small community in Morocco’s Middle Atlas. Built slowly, with care.</p></div>
      <span className="gather-vision-label">An imagined future · not open for bookings</span>
    </section>
    <section className="gather-introduction"><p className="gather-kicker">The idea</p><h2>More than a place<br />to put a laptop.</h2><p>A working farm. A maker’s home. A table with room for one more. This is the direction the dream is growing in—rooted in the landscapes around Ifrane, Azrou and Midelt.</p></section>
    <section className="gather-spaces" aria-label="The future spaces">{spaces.map(space => <article id={space.id} key={space.no} className="gather-space"><span className="gather-number">{space.no}</span><div><p className="gather-kicker">{space.tag}</p><h2>{space.title}</h2><p>{space.text}</p><a href={space.href} target="_blank" rel="noreferrer">{space.cta} ↗</a></div></article>)}</section>
    <section className="gather-status"><span className="gather-status-dot" /><div><h2>A vision taking shape.</h2><p>Meetup dates, visitor arrangements and bookings haven’t been announced. This is a digital exploration of what the farm could become. Follow the build for real progress and future invitations.</p><Link href="/references">Explore the real places behind the vision ↗</Link></div></section>
    <footer className="gather-bottom"><span>Rooted in the Middle Atlas. Open to the world.</span><Link href="/">Return to the farm ↗</Link></footer>
  </main>;
}
