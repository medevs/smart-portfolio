"use client";
import { useEffect, useRef } from "react";
import { walk, cancelWalkRoute } from "../scene/walk-state";
import { bindMovementPad } from "./pad-controls";

export function MovementPad() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) return bindMovementPad(ref.current, walk, cancelWalkRoute);
  }, []);
  return (
    <div
      className="joystick"
      ref={ref}
      role="group"
      aria-label="Movement pad: touch, then drag gently to walk; drag farther to move faster. Keyboard: WASD or arrow keys."
    >
      <span className="pad-hint" aria-hidden="true">
        ↑
      </span>
      <span className="pad-thumb" aria-hidden="true" />
    </div>
  );
}
