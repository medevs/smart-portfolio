import { FarmExperience } from "@/components/farm/FarmExperience";
import { offerings } from "@/config/shop";
import { notFound } from "next/navigation";
import { loadFarm, placePlots, findSpot } from "@/farm/loadFarm";
import type { Metadata } from "next";

type Params = { id: string };

function titleFor(id: string, farm: Awaited<ReturnType<typeof loadFarm>>) {
  return (
    findSpot(placePlots(farm), id)?.item.name ??
    offerings.find((entry) => entry.id === id)?.title ??
    "A spot on the farm"
  );
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
  if (!findSpot(placePlots(farm), id)) notFound();
  return <FarmExperience farm={farm} initialSpot={id} />;
}
