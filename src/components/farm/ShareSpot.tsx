"use client";
import { useState } from "react";

export function ShareSpot({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/spot/${id}`;

  async function share() {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "medevsmaker's farm", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <div className="share-row">
      <button type="button" className="text-link" onClick={share}>
        {copied ? "Link copied" : "Share my spot"}
      </button>
      <input readOnly value={path} aria-label="Link to this spot" />
    </div>
  );
}
