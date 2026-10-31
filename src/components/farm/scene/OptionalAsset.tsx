"use client";

import { Component, Suspense, type ReactNode } from "react";

/** A failed decorative download must not remove the buildings or stop the world. */
export class AssetBoundary extends Component<{ children: ReactNode; fallback?: ReactNode; onFailure?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) {
    console.warn("Optional farm detail unavailable:", error.message);
    this.props.onFailure?.();
  }
  render() { return this.state.failed ? this.props.fallback ?? null : this.props.children; }
}

export function OptionalAsset({ children, fallback = null, onFailure }: { children: ReactNode; fallback?: ReactNode; onFailure?: () => void }) {
  return <AssetBoundary fallback={fallback} onFailure={onFailure}><Suspense fallback={fallback}>{children}</Suspense></AssetBoundary>;
}
