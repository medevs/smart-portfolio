/** Deterministic local behaviour, not a biological or agricultural forecasting model. */
export function animalPose(seconds: number, phase = 0, raining = false) {
  const t = (((seconds + phase * 9) % 28) + 28) % 28;
  const walking = !raining && t >= 10 && t < 19;
  const raw = walking ? (t - 10) / 9 : 0;
  const u = raw * raw * (3 - 2 * raw),
    angle = u * Math.PI * 2;
  const ease = (v: number) => {
    const x = Math.max(0, Math.min(1, v));
    return x * x * (3 - 2 * x);
  };
  const grazing = !raining && t < 10 ? ease(t / 0.7) * ease((10 - t) / 0.7) : 0;
  return {
    state: raining ? "shelter" : walking ? "walk" : t < 10 ? "graze" : "rest",
    x: walking ? Math.sin(angle) * 0.42 : 0,
    z: walking ? (1 - Math.cos(angle)) * 0.24 : 0,
    heading: walking ? Math.atan2(-Math.sin(angle) * 0.24, Math.cos(angle) * 0.42) : 0,
    gait: walking ? Math.sin(u * Math.PI * 12) * Math.sin(raw * Math.PI) : 0,
    head: 0.03 + grazing * (0.59 + Math.sin(seconds * 1.7 + phase) * 0.035),
    tail: Math.sin(seconds * 1.4 + phase) * 0.14,
    breath: Math.sin(seconds * 1.3 + phase) * 0.008,
  };
}
export type VehicleSample = { x: number; z: number; yaw: number };
export type VehicleVisual = VehicleSample & { rear: number; front: number; steer: number };
export function vehicleVisual(
  previous: VehicleVisual,
  sample: VehicleSample,
  paused: boolean,
): VehicleVisual {
  const dx = sample.x - previous.x,
    dz = sample.z - previous.z;
  const distance = dx * Math.sin(sample.yaw) + dz * Math.cos(sample.yaw);
  const turn = Math.atan2(Math.sin(sample.yaw - previous.yaw), Math.cos(sample.yaw - previous.yaw));
  if (paused || Math.hypot(dx, dz) > 2)
    return { ...sample, rear: previous.rear, front: previous.front, steer: previous.steer };
  return {
    ...sample,
    rear: previous.rear - distance / 0.4,
    front: previous.front - distance / 0.245,
    steer:
      Math.abs(distance) > 0.002
        ? Math.max(-0.48, Math.min(0.48, Math.atan(turn / distance)))
        : previous.steer * 0.9,
  };
}

/** A gentle approach within a home leash; physical obstacles are checked by the caller. */
export function companionPose(
  previous: ReturnType<typeof animalPose>,
  seconds: number,
  dt: number,
  visitor: { x: number; z: number },
  raining = false,
) {
  if (dt <= 0) return previous;
  const distance = Math.hypot(visitor.x, visitor.z),
    interested = !raining && distance < 5;
  const radius = interested ? Math.min(2.2, Math.max(0, distance - 1.15)) : 0;
  const target = {
    x: distance > 0 ? (visitor.x / distance) * radius : 0,
    z: distance > 0 ? (visitor.z / distance) * radius : 0,
  };
  const dx = target.x - previous.x,
    dz = target.z - previous.z,
    length = Math.hypot(dx, dz);
  const travel = Math.min(length, 0.85 * Math.min(dt, 0.05));
  const moving = travel > 0.002;
  const desired = moving
    ? Math.atan2(-dz, dx)
    : interested
      ? Math.atan2(-(visitor.z - previous.z), visitor.x - previous.x)
      : previous.heading;
  const turn = Math.atan2(
    Math.sin(desired - previous.heading),
    Math.cos(desired - previous.heading),
  );
  const heading = previous.heading + Math.max(-2.4 * dt, Math.min(2.4 * dt, turn));
  // Turn before advancing, rather than sliding sideways toward the target.
  const advance = Math.abs(turn) < 0.6 ? travel : 0;
  const pose = animalPose(seconds, 0, raining);
  return {
    ...pose,
    state: raining ? "shelter" : moving ? "walk" : interested ? "greet" : "rest",
    x: previous.x + (length ? (dx / length) * advance : 0),
    z: previous.z + (length ? (dz / length) * advance : 0),
    heading,
    head: 0.03,
    gait: advance ? Math.sin(seconds * 8) * 0.7 : 0,
    tail: Math.sin(seconds * (interested ? 7 : 1.4)) * (interested ? 0.45 : 0.14),
  };
}
