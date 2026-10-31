"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function ThemeToggle() {
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return <div className="h-6 w-6" aria-hidden="true" />;
  }

  return (
    <button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-md p-2 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-foreground" />
      )}
    </button>
  );
}
