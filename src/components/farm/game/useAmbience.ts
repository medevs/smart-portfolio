"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createAmbienceEngine } from "./ambience-engine";

/** Quiet local synthesis, created only by a deliberate click. */
export function useAmbience(paused: boolean, volume: number) {
  const engine = useMemo(() => createAmbienceEngine(), []);
  const mounted = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      engine.stop();
    };
  }, [engine]);
  useEffect(() => {
    const update = () => engine.setLevel(paused || document.hidden ? 0 : volume * 0.12);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [engine, paused, volume]);
  async function toggle() {
    if (engine.active) {
      engine.stop();
      setEnabled(false);
      setError("");
      return;
    }
    const result = await engine.start();
    if (!mounted.current || result === "cancelled") return;
    setEnabled(result === "started");
    setError(result === "failed" ? "Sound could not start on this device." : "");
  }
  return { enabled, error, toggle };
}
