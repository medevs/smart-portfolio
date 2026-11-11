"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="font-mono text-sm text-terminal-muted mb-4">Something broke</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
        The farm hit a snag.
      </h1>
      <p className="text-terminal-muted mb-8">
        That was on our side. Try again, or head back to the farm.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-full font-medium bg-terminal-green/20 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/30 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full font-medium border border-card-theme-border text-foreground hover:border-terminal-cyan/30 hover:text-terminal-cyan transition-colors"
        >
          Back to the farm
        </Link>
      </div>
    </main>
  );
}
