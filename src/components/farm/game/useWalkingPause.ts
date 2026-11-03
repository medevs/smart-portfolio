"use client";
import { useEffect } from "react";
import { resetWalkInput, walk } from "../scene/walk-state";

/** Keep the pause/input handoff shared by the production host and physics integration checks. */
export function useWalkingPause(paused: boolean) {
  useEffect(() => {
    walk.paused = paused;
    resetWalkInput({ preserveRouteRequest: !paused });
    return () => {
      walk.paused = true;
      resetWalkInput({ preserveRouteRequest: paused });
    };
  }, [paused]);
}
