import { formatLegalAddress, legal } from "@/config/legal";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum gemäß § 5 DDG.",
};

export default function ImpressumPage() {
  const address = formatLegalAddress(legal.address);

  return (
    <main className="paper-page">
      <div className="wrap">
        <p>
          <Link href="/">← Farm</Link>
        </p>
        <h1>Impressum</h1>
        <p>Dieses Angebot erscheint unter dem Namen medevsmaker.</p>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          {legal.name}
          <br />
          {legal.address.street}
          <br />
          {legal.address.postalCode} {legal.address.city}
          <br />
          {legal.address.country}
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href={`mailto:${legal.email}`}>{legal.email}</a>
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>
          {legal.responsible.name}
          <br />
          {address}
        </p>
      </div>
    </main>
  );
}
