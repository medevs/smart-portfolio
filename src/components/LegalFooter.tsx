import Link from "next/link";

export default function LegalFooter() {
  return (
    <footer className="legal-footer">
      <Link href="/impressum">Impressum</Link>
      <Link href="/datenschutz">Datenschutz</Link>
    </footer>
  );
}
