import { offerings, formatMoney, landmarkPrice, shop, skuBasePrice } from "@/config/shop";
import { experiences } from "@/config/experience";
import { skillCategories } from "@/config/skills";
import { loadFarm, plotsRemaining } from "@/farm/loadFarm";
import { getSortedPostsData } from "../../../utils/markdown";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "List",
  description: "Everything on the farm, in a list: products, the dream-home shop, notes, and contact.",
};

export default async function ListPage() {
  const [farm, posts] = await Promise.all([loadFarm(), getSortedPostsData()]);
  const interactive = farm.plots.filter((plot) => farm.items.find((item) => item.id === plot.itemId)?.interactive);

  return (
    <main className="paper-page">
      <div className="wrap">
        <p>
          <Link href="/">← Wander the farm</Link>
        </p>
        <h1>medevsmaker</h1>
        <p>
          A farm of things made in code. The barn is ReelStyles. This page is the plain list, for reading, search, and
          keyboards.
        </p>

        <h2>Places</h2>
        <ul className="card-list">
          {interactive.map((plot) => {
            const item = farm.items.find((entry) => entry.id === plot.itemId);
            if (!item) return null;
            return (
              <li key={plot.id}>
                <article>
                  <h3>
                    {item.name}
                    {item.place ? ` · ${item.place}` : ""}
                  </h3>
                  {item.pitch && <p>{item.pitch}</p>}
                  <p>
                    <Link href={`/spot/${plot.id}`}>Open on the farm</Link>
                    {item.cta && (
                      <>
                        {" · "}
                        <a href={item.cta.href}>{item.cta.label}</a>
                      </>
                    )}
                  </p>
                  {item.links?.map((link) =>
                    link.todo || !link.href ? (
                      <p key={link.label}>TODO: {link.label}</p>
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

        <h2>Field notes</h2>
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
