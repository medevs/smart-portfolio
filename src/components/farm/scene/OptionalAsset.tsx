"use client";

import { Component, Suspense, type ReactNode } from "react";

/** A failed decorative download must not remove the buildings or stop the world. */
export class AssetBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.warn("Optional farm detail unavailable:", error.message); }
  render() { return this.state.failed ? this.props.fallback ?? null : this.props.children; }
}

export function OptionalAsset({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <AssetBoundary fallback={fallback}><Suspense fallback={fallback}>{children}</Suspense></AssetBoundary>;
}
