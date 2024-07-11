import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import AIChatButton from "./AIChatButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-background z-50">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-3 py-4 ">
        <nav className="space-x-4 font-medium">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/github-stats">Gtihub in Magic</Link>
        </nav>
        <div className="flex items-center gap-4">
          <AIChatButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
