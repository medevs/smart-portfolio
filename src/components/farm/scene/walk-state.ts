import type { Point } from "@/farm/game/world";

/** Shared by the walk controls, the physics bodies, and the tractor mesh. */
export const walk = {
  keys: { w: false, a: false, s: false, d: false },
  cameraCut: true,
  driving: false,
  paused: false,
  toggleDrive: false,
  px: 0,
  pz: 8,
  tx: 0,
  tz: 0,
  yaw: Math.PI,
  vehicleYaw: Math.PI / 2,
  sprinting: false,
  moving: 0,
  travel: null as Point | null,
  stickX: 0,
  stickY: 0,
};

export const TRACTOR = { x: 0, z: 5.5 };

/** Clear transient input without moving the visitor or parked tractor. */
export function resetWalkInput() {
  walk.keys.w = walk.keys.a = walk.keys.s = walk.keys.d = false;
  walk.stickX = 0;
  walk.stickY = 0;
  walk.toggleDrive = false;
  walk.sprinting = false;
  walk.moving = 0;
}

/** WASD moves in a stable world frame; facing never feeds back into input. */
export function walkingMovement(forward: number, strafe: number, dt: number, sprint = false) {
  const length = Math.max(1, Math.hypot(forward, strafe));
  const distance = 3.6 * (sprint ? 1.65 : 1) * Math.min(Math.max(dt, 0), 0.05);
  return { x: (strafe / length) * distance, z: (-forward / length) * distance };
}
