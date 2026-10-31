"use client";

import { Component, useEffect, useRef, type ReactNode } from "react";
import { createRoot, events, extend, type RootState } from "@react-three/fiber";
import * as THREE from "three";

extend(THREE as unknown as Parameters<typeof extend>[0]);

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) {
    console.error("Farm scene failed:", error);
    this.props.onFailure();
  }
  render() { return this.state.failed ? null : this.props.children; }
}

/** Own the async renderer setup so a rejected WebGL configuration is handled too.
 * React error boundaries alone cannot catch a rejection in Canvas's async effect.
 * https://r3f.docs.pmnd.rs/api/canvas#custom-canvas
 */
export function SceneRoot({ children, low, onFailure }: { children: ReactNode; low: boolean; onFailure: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const root = useRef<ReturnType<typeof createRoot<HTMLCanvasElement>> | null>(null);
  const configured = useRef(false);
  const state = useRef<RootState | null>(null);
  const current = useRef({ children, low, onFailure });
  current.current = { children, low, onFailure };

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const element = document.createElement("canvas");
    element.setAttribute("aria-label", "Interactive 3D Middle Atlas farm. Drag to orbit, or use Walk to explore.");
    container.appendChild(element);
    let disposed = false;
    let starting = false;
    const renderer = createRoot(element);
    root.current = renderer;
    const fail = (error: unknown) => {
      if (disposed) return;
      console.error("Farm renderer failed:", error);
      current.current.onFailure();
    };
    const resize = async () => {
      const { width, height, top, left } = container.getBoundingClientRect();
      if (!width || !height || disposed) return;
      if (state.current) {
        state.current.setSize(width, height, top, left);
        return;
      }
      if (starting || configured.current) return;
      starting = true;
      await renderer.configure({
        size: { width, height, top, left },
        events,
        shadows: true,
        dpr: current.current.low ? [1, 1.2] : [1, 1.5],
        camera: { position: [34, 25, 39], fov: 45, near: 0.1, far: 240 },
        gl: { antialias: !current.current.low, powerPreference: "default", preserveDrawingBuffer: false },
        onCreated: created => {
          if (disposed) return;
          state.current = created;
          created.events.connect?.(element);
          const bounds = container.getBoundingClientRect();
          created.setSize(bounds.width, bounds.height, bounds.top, bounds.left);
          created.setDpr(current.current.low ? [1, 1.2] : [1, 1.5]);
        },
      });
      starting = false;
      if (disposed) return;
      configured.current = true;
      renderer.render(<SceneBoundary onFailure={() => current.current.onFailure()}>{current.current.children}</SceneBoundary>);
    };
    const lost = (event: Event) => {
      event.preventDefault();
      fail(new Error("WebGL context lost"));
    };
    element.addEventListener("webglcontextlost", lost);
    const observer = new ResizeObserver(() => { void resize().catch(fail); });
    observer.observe(container);
    void resize().catch(fail);
    return () => {
      disposed = true;
      configured.current = false;
      state.current = null;
      observer.disconnect();
      element.removeEventListener("webglcontextlost", lost);
      renderer.unmount();
      element.remove();
      root.current = null;
    };
  }, []);

  useEffect(() => {
    if (!configured.current || !root.current) return;
    root.current.render(<SceneBoundary onFailure={onFailure}>{children}</SceneBoundary>);
    state.current?.setDpr(low ? [1, 1.2] : [1, 1.5]);
  }, [children, low, onFailure]);

  return <div ref={host} className="world-renderer" />;
}
