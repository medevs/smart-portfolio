/** A bounded bicycle-style controller for the digital tractor, in world units. */
export function tractorDrive(speed: number, throttle: number, steering: number, dt: number) {
  const step = Math.max(0, Math.min(dt, 0.05));
  const input = Math.max(-1, Math.min(1, throttle));
  // Rapier can leave tiny contact velocities at a wall. Treat these as stopped
  // so contact correction cannot keep the gearbox in its braking phase forever.
  const current = Math.abs(speed) < 0.05 ? 0 : speed;
  // Opposite input first brakes to a stop; reverse starts on the following step.
  const braking = input === 0 || current * input < 0;
  const target = braking ? 0 : input * (input < 0 ? 3 : 7);
  const change = (braking ? 12 : 8) * step;
  const next = current + Math.max(-change, Math.min(change, target - current));
  const angle = -Math.max(-1, Math.min(1, steering)) * 0.48;
  // Signed speed makes reverse steering follow the wheels. No stationary pivot.
  const yawRate = Math.max(-1.3, Math.min(1.3, (next * Math.tan(angle)) / 1.04));
  return { speed: next, yawRate };
}
