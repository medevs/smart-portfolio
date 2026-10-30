import { offerings, formatMoney, landmarkPrice, shop, skuBasePrice } from "@/config/shop";
import { experiences } from "@/config/experience";
import { skillCategories } from "@/config/skills";
import { loadFarm, plotsRemaining } from "@/farm/loadFarm";
import { getSortedPostsData } from "../../../utils/markdown";
import type { Metadata } from "next";
import Link from "next/link";
import "./list.css";

export const metadata: Metadata = {
  title: "List",
  description: "Everything on the farm, in a list: products, the dream-home shop, notes, and contact.",
};

export default async function ListPage() {
  const [farm, posts] = await Promise.all([loadFarm(), getSortedPostsData()]);
  const featured = ["reelstyles", "about", "mentorclone", "talkthedoc"];
  const rank = (itemId: string) => { const index = featured.indexOf(itemId); return index < 0 ? featured.length : index; };
  const interactive = farm.plots
    .filter((plot) => farm.items.find((item) => item.id === plot.itemId)?.interactive)
    .sort((a, b) => rank(a.itemId) - rank(b.itemId));

  return (
    <main className="paper-page farm-directory">
      <div className="wrap">
        <p>
          <Link href="/">← Wander the farm</Link>
        </p>
        <p className="directory-kicker">medevsmaker · Middle Atlas</p>
        <h1>Explore the farm.</h1>
        <p>
          Every project, place and field note in one readable list. ReelStyles lives in the courtyard workshop. You can explore everything here without opening the 3D world.
        </p>

        <nav className="directory-nav" aria-label="Farm directory sections">
          <a href="#places">Projects & places</a><Link href="/gather">Future gatherings</Link><a href="#field-notes">Field notes</a><Link href="/open">Dream Home Fund</Link>
        </nav>
        <h2 id="places">Projects & places</h2>
        <ul className="card-list">
          {interactive.map((plot) => {
            const item = farm.items.find((entry) => entry.id === plot.itemId);
            if (!item) return null;
            return (
              <li key={plot.id}>
                <article>
                  <h3>
                    {item.name}
                    {item.place && item.place !== item.name ? <span>{item.place}</span> : null}
                  </h3>
                  {item.pitch && <p>{item.pitch}</p>}
                  <p>
                    <Link href={`/spot/${plot.id}`} aria-label={`Open ${item.name} on the farm`}>Open on the farm ↗</Link>
                    {item.cta && (
                      <>
                        {" · "}
                        <a href={item.cta.href}>{item.cta.label}</a>
                      </>
                    )}
                  </p>
                  {item.links?.map((link) =>
                    link.todo || !link.href ? (
                      <p key={link.label} className="directory-pending">{link.label} — not available yet</p>
                    ) : (
                      <p key={link.label}>
                        <a href={link.href}>{link.label}</a>
                      </p>
                    )
                  )}
                </article>
              </li>
            );
          })}
        </ul>

        <h2>Help build the dream home</h2>
        <ul>
          {offerings.map((offering) => {
            const price = offering.landmark
              ? formatMoney(landmarkPrice(farm.sponsors.landmarks[offering.landmark].takeovers))
              : offering.sku === "dogAuction"
                ? "Auction placeholder"
                : offering.sku
                  ? formatMoney(skuBasePrice(offering.sku) ?? 0)
                  : "";
            return (
              <li key={offering.id}>
                <Link href={`/spot/${offering.id}`}>{offering.title}</Link> — {price}
                {offering.sku === "plot" ? ` (${plotsRemaining(farm.sponsors)} of ${shop.limits.plots} left)` : ""}
                . {offering.blurb}
              </li>
            );
          })}
        </ul>
        <p>
          <Link href="/open">Dream Home Fund</Link>
        </p>

        <h2 id="field-notes">Field notes</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>

        <h2>Work</h2>
        <ul>
          {experiences.map((job) => (
            <li key={job.id}>
              {job.role} at {job.company} ({job.period})
            </li>
          ))}
        </ul>

        <h2>Tools</h2>
        <ul>
          {skillCategories.map((group) => (
            <li key={group.name}>
              {group.name}: {group.skills.map((skill) => skill.name).join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
