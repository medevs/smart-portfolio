import Link from "next/link";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground pb-12">
      <header className="sticky top-0 z-20 border-b border-terminal-border bg-terminal-bg/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-lg text-foreground">
            medevsmaker
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/list" className="text-terminal-muted hover:text-terminal-green">
              List
            </Link>
            <Link href="/blog" className="text-terminal-muted hover:text-terminal-green">
              Journal
            </Link>
            <Link href="/open" className="text-terminal-muted hover:text-terminal-green">
              Fund
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
