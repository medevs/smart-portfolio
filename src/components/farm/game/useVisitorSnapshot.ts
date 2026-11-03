"use client";
import { useEffect, useState } from "react";
import { TRACTOR, walk } from "../scene/walk-state";

export function useVisitorSnapshot() {
  const [point, setPoint] = useState({
    x: 0,
    z: 8,
    driving: false,
    sprinting: false,
    route: walk.route,
    routeStatus: walk.routeStatus,
    routeRequest: walk.routeRequest,
  });
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const next = walk.driving
        ? { x: TRACTOR.x + walk.tx, z: TRACTOR.z + walk.tz }
        : { x: walk.px, z: walk.pz };
      setPoint((previous) =>
        previous.x === next.x &&
        previous.z === next.z &&
        previous.driving === walk.driving &&
        previous.sprinting === walk.sprinting &&
        previous.route === walk.route &&
        previous.routeStatus === walk.routeStatus &&
        previous.routeRequest === walk.routeRequest
          ? previous
          : {
              ...next,
              driving: walk.driving,
              sprinting: walk.sprinting,
              route: walk.route,
              routeStatus: walk.routeStatus,
              routeRequest: walk.routeRequest,
            },
      );
    }, 200);
    return () => clearInterval(timer);
  }, []);
  return point;
}
