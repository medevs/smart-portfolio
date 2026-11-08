import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page is not on the farm. Head back to the farm, the blog or get in touch.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="font-mono text-sm text-terminal-muted mb-4">404</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
        This path leads nowhere on the farm.
      </h1>
      <p className="text-terminal-muted mb-8">
        The page you wanted has moved or never existed. The farm, the journal and the mailbox are
        all still here.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/spot/mailbox"
          className="px-5 py-2.5 rounded-full font-medium bg-terminal-green/20 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/30 transition-colors"
        >
          Ask about a 3D walkthrough
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full font-medium border border-card-theme-border text-foreground hover:border-terminal-cyan/30 hover:text-terminal-cyan transition-colors"
        >
          Wander the farm
        </Link>
        <Link
          href="/blog"
          className="px-5 py-2.5 rounded-full font-medium border border-card-theme-border text-foreground hover:border-terminal-cyan/30 hover:text-terminal-cyan transition-colors"
        >
          Read the blog
        </Link>
      </div>
    </main>
  );
}
