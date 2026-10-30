/** Shared by the walk controls, the physics bodies, and the tractor mesh. */
export const walk = {
  driving: false,
  paused: false,
  toggleDrive: false,
  px: 0,
  pz: 8,
  tx: 0,
  tz: 0,
  yaw: Math.PI,
  stickX: 0,
  stickY: 0,
};

export const TRACTOR = { x: 0, z: 5.5 };

/** Clear transient input without moving the visitor or parked tractor. */
export function resetWalkInput() {
  walk.stickX = 0;
  walk.stickY = 0;
  walk.toggleDrive = false;
}

/** WASD moves in a stable world frame; facing never feeds back into input. */
export function walkingMovement(forward: number, strafe: number, dt: number) {
  const length = Math.max(1, Math.hypot(forward, strafe));
  const distance = 3.6 * Math.min(Math.max(dt, 0), 0.05);
  return { x: (strafe / length) * distance, z: (-forward / length) * distance };
}
