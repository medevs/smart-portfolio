"use client";
import { deliveryContext } from "../scene/delivery-state";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  freshProfile,
  readProfile,
  writeProfile,
  type Preferences,
  type Profile,
} from "@/farm/game/save";
import { TOUR_STOPS, tourIndex as findTourIndex } from "@/farm/game/tour";
import { discover } from "@/farm/game/discoveries";
import { freshPractice, practiceStep } from "@/farm/game/tutorial";
import { guideMarker } from "../scene/guide-state";
import { cameraView } from "../scene/camera-view";
import { zoomCamera } from "../scene/camera-view";
import { canTransferBasket, nearbyApple, transferBasket, harvestApple } from "@/farm/game/journey";
import { interact, nextActivity } from "@/farm/game/progress";
import { activityTarget } from "@/farm/game/activity-target";
import { destination, nearestPlace, SPAWN, type DestinationId } from "@/farm/game/world";
import { safeSpawn } from "@/farm/game/collision";
import { resetWalkInput, walk, cancelWalkRoute } from "../scene/walk-state";

export type Panel =
  | "welcome"
  | "map"
  | "journal"
  | "settings"
  | "pause"
  | "controls"
  | "notes"
  | "reset"
  | "tour"
  | "tutorial"
  | null;
export function useFarmGame({
  ready,
  exploring,
  externalPaused,
  onExplore,
  onProduct,
}: {
  ready: boolean;
  exploring: boolean;
  externalPaused: boolean;
  onExplore: () => void;
  onProduct: (id: string) => void;
}) {
  const [practicing, setPracticing] = useState(false);
  const [practice, setPractice] = useState(freshPractice);
  const practiceStart = useRef({ x: 0, z: 0, distance: 6.2, turn: 0 });
  const practiceCurrent = useRef(practice);
  useLayoutEffect(() => {
    practiceCurrent.current = practice;
  }, [practice]);
  const [profile, setProfile] = useState<Profile>(freshProfile);
  const [loaded, setLoaded] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
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
  useLayoutEffect(() => {
    current.current = profile;
  }, [profile]);
  const restored = useRef(false);
  const visiblePanel: Panel =
    panel ?? (loaded && ready && !externalPaused && !profile.introduced ? "welcome" : null);
  const paused = externalPaused || visiblePanel !== null;
  useEffect(() => {
    try {
      const saved = readProfile(window.localStorage);
      // Load browser storage after hydration; the server cannot read this external state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(saved.profile);
      setStorageAvailable(saved.available);
    } catch {
      setStorageAvailable(false);
    }
    const chapter = findTourIndex(new URLSearchParams(window.location.search).get("tour"));
    if (chapter >= 0) {
      setTourIndex(chapter);
      setPanel("tour");
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded || !ready || restored.current) return;
    restored.current = true;
    walk.px = profile.position.x;
    walk.pz = profile.position.z;
    walk.travel = { ...profile.position };
  }, [loaded, ready, profile.position]);
  const save = useCallback(() => {
    const point = { x: walk.px, z: walk.pz };
    const next = {
      ...current.current,
      position: !restored.current
        ? current.current.position
        : !walk.driving && safeSpawn(point)
          ? point
          : SPAWN,
    };
    try {
      setStorageAvailable(writeProfile(window.localStorage, next));
    } catch {
      setStorageAvailable(false);
    }
  }, []);
  useEffect(() => {
    if (loaded) save();
  }, [loaded, profile, save]);
  useEffect(() => {
    if (!loaded) return;
    const timer = window.setInterval(save, 10000);
    window.addEventListener("pagehide", save);
    return () => {
      clearInterval(timer);
      window.removeEventListener("pagehide", save);
    };
  }, [loaded, save]);
  useEffect(() => {
    if (!practicing || !ready || !exploring || paused) {
      guideMarker.point = null;
      return;
    }
    const sample = () => {
      const previous = practiceCurrent.current;
      if (previous.needsExit && !walk.driving) {
        // Record the actual on-foot location after physics has completed the exit.
        // Its relocation must not count as the walking lesson.
        practiceStart.current = {
          x: walk.px,
          z: walk.pz,
          distance: cameraView.distance,
          turn: cameraView.turn,
        };
      }
      const start = practiceStart.current,
        needsExit = previous.needsExit && walk.driving;
      const next = {
        ...previous,
        needsExit,
        moved:
          previous.moved ||
          (!previous.needsExit && Math.hypot(walk.px - start.x, walk.pz - start.z) > 1),
        looked:
          previous.looked ||
          (!previous.needsExit &&
            (Math.abs(cameraView.distance - start.distance) > 0.25 ||
              Math.abs(cameraView.turn - start.turn) > 0.15)),
        loaded: previous.loaded || current.current.progress.basket === "trailer",
      };
      if (
        next.needsExit !== previous.needsExit ||
        next.moved !== previous.moved ||
        next.looked !== previous.looked ||
        next.loaded !== previous.loaded
      )
        setPractice(next);
      guideMarker.point = practiceStep(next, current.current.progress, deliveryContext()).target;
    };
    sample();
    const timer = window.setInterval(sample, 200);
    return () => {
      window.clearInterval(timer);
      guideMarker.point = null;
    };
  }, [practicing, ready, exploring, paused]);
  const close = useCallback(() => {
    setPanel(null);
    setProfile((value) => (value.introduced ? value : { ...value, introduced: true }));
  }, []);
  const act = useCallback(() => {
    if (!ready || !exploring || paused || walk.driving) return;
    cancelWalkRoute();
    const point = { x: walk.px, z: walk.pz };
    const place = nearestPlace(point);
    const progress = current.current.progress;
    const context = deliveryContext();
    const journey =
      nearbyApple(progress, point) >= 0
        ? harvestApple(progress, point, true)
        : canTransferBasket(progress, point, context)
          ? transferBasket(progress, point, context, true)
          : null;
    if (journey) {
      if (journey.changed) {
        setProfile((value) => ({ ...value, progress: journey.progress }));
        setWaypoint(nextActivity(journey.progress)?.id ?? null);
      }
      setMessage(journey.message);
      return;
    }
    const observation = discover(current.current.discoveries, place.id, point, true);
    if (observation.note) {
      if (observation.changed)
        setProfile((value) => ({ ...value, discoveries: observation.found }));
      setPanel("notes");
      return;
    }
    const result = interact(progress, place.id, point, true);
    setMessage(result.message);
    if (result.changed) {
      setProfile((value) => ({ ...value, progress: result.progress }));
      setWaypoint(nextActivity(result.progress)?.id ?? null);
    }
    if (Math.hypot(point.x - place.x, point.z - place.z) <= 3.2 && "product" in place)
      onProduct(place.product);
  }, [ready, exploring, paused, onProduct]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        externalPaused
      )
        return;
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("input, textarea, select, [contenteditable='true'], [role='dialog']")
      )
        return;
      if (visiblePanel) return; // Radix owns Escape and focus while a panel is open.
      const k = event.key.toLowerCase();
      if (k === "h" || k === "?") {
        event.preventDefault();
        setPanel("tutorial");
      }
      if (k === "m" || k === "j" || k === "escape") {
        event.preventDefault();
        setPanel(k === "m" ? "map" : k === "j" ? "journal" : "pause");
      }
      if (ready && (k === "+" || k === "=" || k === "-" || k === "_")) {
        event.preventDefault();
        zoomCamera(k === "+" || k === "=" ? -0.15 : 0.15);
      }
      if (k === "e") {
        event.preventDefault();
        act();
      }
    };
    // Inspect dialog state before Radix dismisses and detaches the key target.
    window.addEventListener("keydown", key, { capture: true });
    return () => window.removeEventListener("keydown", key, { capture: true });
  }, [act, visiblePanel, externalPaused, ready]);
  function travel(id: DestinationId) {
    const target = destination(id);
    if (!ready || !target || !safeSpawn(target)) return;
    cancelWalkRoute();
    walk.travel = { x: target.x, z: target.z };
    resetWalkInput();
    onExplore();
    close();
    setWaypoint(id);
    setMessage(`Travelling to ${target.name.toLowerCase()}.`);
  }
  function walkTo(id: DestinationId) {
    const place = destination(id);
    if (!ready || externalPaused || !place) return;
    if (walk.driving) {
      setMessage("Park and exit the tractor before choosing a walking route.");
      return;
    }
    const progress = current.current.progress;
    const point = activityTarget(progress, id, deliveryContext());
    cancelWalkRoute();
    resetWalkInput();
    walk.travel = null;
    walk.routeRequest = point;
    onExplore();
    close();
    setWaypoint(id);
    setMessage("");
  }
  function stopWalking() {
    cancelWalkRoute();
    setMessage("Walking stopped. You have the controls.");
  }
  function tourStep(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= TOUR_STOPS.length) return;
    cancelWalkRoute();
    resetWalkInput();
    setTourIndex(index);
    setPanel("tour");
  }
  function startPractice() {
    if (!ready) return;
    practiceStart.current = {
      x: walk.px,
      z: walk.pz,
      distance: cameraView.distance,
      turn: cameraView.turn,
    };
    setPractice({ ...freshPractice(), needsExit: walk.driving });
    setPracticing(true);
    cancelWalkRoute();
    resetWalkInput();
    onExplore();
    close();
  }
  function stopPractice() {
    setPracticing(false);
    guideMarker.point = null;
  }
  function carryOnFoot() {
    setPractice((value) => ({ ...value, route: "walk" }));
  }
  function preferences(patch: Partial<Preferences>) {
    setProfile((value) => ({ ...value, preferences: { ...value.preferences, ...patch } }));
  }
  function reset() {
    const fresh = freshProfile();
    stopPractice();
    cancelWalkRoute();
    setProfile((value) => ({ ...fresh, preferences: value.preferences, introduced: true }));
    setWaypoint(null);
    setMessage("A fresh journal. Your settings are kept.");
    walk.travel = { ...SPAWN };
    close();
  }
  return {
    practicing,
    practice,
    startPractice,
    stopPractice,
    carryOnFoot,
    tourIndex,
    tourStep,
    profile,
    panel: visiblePanel,
    setPanel,
    close,
    waypoint,
    setWaypoint,
    message,
    storageAvailable,
    paused,
    act,
    travel,
    walkTo,
    stopWalking,
    preferences,
    reset,
  };
}
export type FarmGame = ReturnType<typeof useFarmGame>;
