"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export default function TypingText({
  text,
  speed = 50,
  delay = 0,
  className,
  showCursor = true,
  onComplete,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedText, text, speed, started, onComplete]);

  return (
    <span className={cn("font-mono", className)}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="inline-block w-2 h-4 ml-0.5 bg-terminal-green animate-cursor-blink" />
      )}
      {showCursor && isComplete && (
        <span className="inline-block w-2 h-4 ml-0.5 bg-terminal-green animate-cursor-blink" />
      )}
    </span>
  );
}
