/** Deterministic local behaviour, not a biological or agricultural forecasting model. */
export function animalPose(seconds: number, phase = 0, raining = false) {
  const t = ((seconds + phase * 9) % 28 + 28) % 28;
  const walking = !raining && t >= 10 && t < 19;
  const raw = walking ? (t - 10) / 9 : 0;
  const u = raw * raw * (3 - 2 * raw), angle = u * Math.PI * 2;
  const ease = (v: number) => { const x = Math.max(0, Math.min(1, v)); return x*x*(3-2*x); };
  const grazing = !raining && t < 10 ? ease(t/.7)*ease((10-t)/.7) : 0;
  return {
    state: raining ? "shelter" : walking ? "walk" : t < 10 ? "graze" : "rest",
    x: walking ? Math.sin(angle) * .42 : 0,
    z: walking ? (1 - Math.cos(angle)) * .24 : 0,
    heading: walking ? Math.atan2(-Math.sin(angle) * .24, Math.cos(angle) * .42) : 0,
    gait: walking ? Math.sin(u * Math.PI * 12) * Math.sin(raw * Math.PI) : 0,
    head: .03 + grazing * (.59 + Math.sin(seconds * 1.7 + phase) * .035),
    tail: Math.sin(seconds * 1.4 + phase) * .14,
    breath: Math.sin(seconds * 1.3 + phase) * .008,
  };
}
export type VehicleSample = { x: number; z: number; yaw: number };
export type VehicleVisual = VehicleSample & { rear: number; front: number; steer: number };
export function vehicleVisual(previous: VehicleVisual, sample: VehicleSample, paused: boolean): VehicleVisual {
  const dx=sample.x-previous.x,dz=sample.z-previous.z;
  const distance=dx*Math.sin(sample.yaw)+dz*Math.cos(sample.yaw);
  const turn=Math.atan2(Math.sin(sample.yaw-previous.yaw),Math.cos(sample.yaw-previous.yaw));
  if(paused||Math.hypot(dx,dz)>2) return {...sample,rear:previous.rear,front:previous.front,steer:previous.steer};
  return {...sample,rear:previous.rear-distance/.4,front:previous.front-distance/.245,steer:Math.abs(distance)>.002?Math.max(-.48,Math.min(.48,Math.atan(turn/ distance))):previous.steer*.9};
}
