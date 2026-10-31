"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { freshProfile, readProfile, writeProfile, type Preferences, type Profile } from "@/farm/game/save";
import { interact } from "@/farm/game/progress";
import { destination, nearestPlace, SPAWN, type DestinationId } from "@/farm/game/world";
import { safeSpawn } from "../scene/yard-boundaries";
import { resetWalkInput, walk } from "../scene/walk-state";

export type Panel = "welcome" | "map" | "journal" | "settings" | "pause" | "controls" | "reset" | null;
export function useFarmGame({ ready, exploring, externalPaused, onExplore, onProduct }: {
  ready: boolean; exploring: boolean; externalPaused: boolean; onExplore: () => void; onProduct: (id: string) => void;
}) {
  const [profile, setProfile] = useState<Profile>(freshProfile);
  const [loaded, setLoaded] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [waypoint, setWaypoint] = useState<DestinationId | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timer);
  }, [message]);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const current = useRef(profile);
  useLayoutEffect(() => { current.current = profile; }, [profile]);
  const restored = useRef(false);
  const visiblePanel: Panel = panel ?? (loaded && ready && !externalPaused && !profile.introduced ? "welcome" : null);
  const paused = externalPaused || visiblePanel !== null;
  useEffect(() => {
    try {
      const saved = readProfile(window.localStorage);
      // Load browser storage after hydration; the server cannot read this external state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(saved.profile); setStorageAvailable(saved.available);

    } catch { setStorageAvailable(false); }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded || !ready || restored.current) return;
    restored.current = true;
    walk.px = profile.position.x; walk.pz = profile.position.z;
    walk.travel = { ...profile.position };
  }, [loaded, ready, profile.position]);
  const save = useCallback(() => {
    const point = { x: walk.px, z: walk.pz };
    const next = { ...current.current, position: !restored.current ? current.current.position : !walk.driving && safeSpawn(point) ? point : SPAWN };
    try { setStorageAvailable(writeProfile(window.localStorage, next)); }
    catch { setStorageAvailable(false); }
  }, []);
  useEffect(() => { if (loaded) save(); }, [loaded, profile, save]);
  useEffect(() => {
    if (!loaded) return;
    const timer = window.setInterval(save, 10000);
    window.addEventListener("pagehide", save);
    return () => { clearInterval(timer); window.removeEventListener("pagehide", save); };
  }, [loaded, save]);
  const close = useCallback(() => {
    setPanel(null);
    setProfile(value => value.introduced ? value : { ...value, introduced: true });
  }, []);
  const act = useCallback(() => {
    if (!ready || !exploring || paused || walk.driving) return;
    const point = { x: walk.px, z: walk.pz };
    const place = nearestPlace(point);
    const result = interact(current.current.progress, place.id, point, true);
    setMessage(result.message);
    if (result.changed) setProfile(value => ({ ...value, progress: result.progress }));
    if (Math.hypot(point.x - place.x, point.z - place.z) <= 3.2 && "product" in place) onProduct(place.product);
  }, [ready, exploring, paused, onProduct]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey || externalPaused) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable='true'], [role='dialog']")) return;
      if (visiblePanel) return; // Radix owns Escape and focus while a panel is open.
      const k = event.key.toLowerCase();
      if (k === "m" || k === "j" || k === "escape") { event.preventDefault(); setPanel(k === "m" ? "map" : k === "j" ? "journal" : "pause"); }
      if (k === "e") { event.preventDefault(); act(); }
    };
    // Inspect dialog state before Radix dismisses and detaches the key target.
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [act, visiblePanel, externalPaused]);
  function travel(id: DestinationId) {
    const target = destination(id);
    if (!ready || !target || !safeSpawn(target)) return;
    walk.travel = { x: target.x, z: target.z };
    resetWalkInput(); onExplore(); close(); setWaypoint(id);
    setMessage(`Travelling to ${target.name.toLowerCase()}.`);
  }
  function preferences(patch: Partial<Preferences>) { setProfile(value => ({ ...value, preferences: { ...value.preferences, ...patch } })); }
  function reset() {
    const fresh = freshProfile();
    setProfile(value => ({ ...fresh, preferences: value.preferences, introduced: true }));
    setWaypoint(null); setMessage("A fresh journal. Your settings are kept.");
    walk.travel = { ...SPAWN }; close();
  }
  return { profile, panel: visiblePanel, setPanel, close, waypoint, setWaypoint, message, storageAvailable, paused, act, travel, preferences, reset };
}
export type FarmGame = ReturnType<typeof useFarmGame>;
