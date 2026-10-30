import { FarmExperience } from "@/components/farm/FarmExperience";
import { offerings } from "@/config/shop";
import { loadFarm } from "@/farm/loadFarm";
import type { Metadata } from "next";

type Params = { id: string };

function titleFor(id: string, farm: Awaited<ReturnType<typeof loadFarm>>) {
  const plot = farm.plots.find((entry) => entry.id === id);
  const item = farm.items.find((entry) => entry.id === (plot?.itemId ?? id));
  const offering = offerings.find((entry) => entry.id === id);
  return item?.name || offering?.title || "A spot on the farm";
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const farm = await loadFarm();
  const title = titleFor(id, farm);
  const description = `${title} on medevsmaker's farm.`;
  return {
    title,
    description,
    openGraph: {
      title: `${title} · medevsmaker`,
      description,
      url: `https://medevsmaker.vercel.app/spot/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · medevsmaker`,
      description,
    },
  };
}

export default async function SpotPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const farm = await loadFarm();
  return <FarmExperience farm={farm} initialSpot={decodeURIComponent(id)} />;
}
