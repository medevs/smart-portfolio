import * as THREE from "three";
import { ORCHARD_TREES } from "@/farm/game/world";
import { YARD_BUILDINGS } from "./yard-boundaries";

export const CAMERA_MIN = 1.8;
export const CAMERA_MAX = 16;
export const cameraView = { distance: 6.2, turn: 0 };
export function setCameraDistance(value: number) {
  if (Number.isFinite(value)) cameraView.distance = Math.max(CAMERA_MIN, Math.min(CAMERA_MAX, value));
}
export function zoomCamera(delta: number) { setCameraDistance(cameraView.distance * Math.exp(delta)); }
export function resetCameraView() { cameraView.distance = 6.2; cameraView.turn = 0; }

/** Use the same building footprints as physics, plus orchard crowns. No per-frame scene traversal. */
const obstacles = YARD_BUILDINGS.map(({ position: p, args: a }) => new THREE.Box3(
  new THREE.Vector3(p[0]-a[0]-.18, p[1]-a[1], p[2]-a[2]-.18),
  new THREE.Vector3(p[0]+a[0]+.18, p[1]+a[1]+.18, p[2]+a[2]+.18),
));
const crowns = ORCHARD_TREES.map(tree => new THREE.Sphere(new THREE.Vector3(tree.x, 2.1, tree.z), 1.35));
const ray = new THREE.Ray(), direction = new THREE.Vector3(), hit = new THREE.Vector3();
export function keepCameraClear(target: THREE.Vector3, desired: THREE.Vector3) {
  direction.subVectors(desired, target);
  let length = direction.length();
  ray.set(target, direction.normalize());
  for (const box of obstacles) {
    if (ray.intersectBox(box, hit)) length = Math.min(length, Math.max(.45, target.distanceTo(hit) - .22));
  }
  for (const sphere of crowns) {
    if (ray.intersectSphere(sphere, hit)) length = Math.min(length, Math.max(.45, target.distanceTo(hit) - .22));
  }
  return desired.copy(target).addScaledVector(direction, length);
}

/** Canvas-only gestures: leave the page, menus and movement pad to their own handlers. */
export function bindFollowCamera(element: HTMLElement) {
  const pointers = new Map<number, { x: number; y: number }>();
  const host = element.ownerDocument?.defaultView;
  const clear = () => {
    for (const id of pointers.keys()) if (element.hasPointerCapture(id)) element.releasePointerCapture(id);
    pointers.clear();
  };
  const gap = () => { const [a,b] = [...pointers.values()]; return a && b ? Math.hypot(a.x-b.x, a.y-b.y) : 0; };
  const wheel = (e: WheelEvent) => { e.preventDefault(); zoomCamera(Math.max(-.25, Math.min(.25, e.deltaY * (e.deltaMode === 1 ? .03 : .0015)))); };
  const down = (e: PointerEvent) => {
    if (e.button !== 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    element.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    const previous = pointers.get(e.pointerId);
    if (!previous) return;
    const before = gap();
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const after = gap();
    if (pointers.size === 2 && before > 1 && after > 1) zoomCamera(Math.log(before / after));
    else if (pointers.size === 1) cameraView.turn -= (e.clientX - previous.x) * .006;
  };
  const up = (e: PointerEvent) => { pointers.delete(e.pointerId); };
  host?.addEventListener("blur", clear);
  element.addEventListener("wheel", wheel, { passive: false });
  element.addEventListener("pointerdown", down);
  element.addEventListener("pointermove", move);
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) element.addEventListener(type, up as EventListener);
  return () => {
    element.removeEventListener("wheel", wheel);
    element.removeEventListener("pointerdown", down);
    element.removeEventListener("pointermove", move);
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) element.removeEventListener(type, up as EventListener);
    host?.removeEventListener("blur", clear);
    clear();
  };
}
