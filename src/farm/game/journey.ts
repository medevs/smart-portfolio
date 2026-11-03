import type { Progress } from "./progress";
import { distance, destination, type Point } from "./world";

/** Low branches on three existing trees; all are reachable beside the trunk colliders. */
export const HARVEST_APPLES = [
  { x: -25, z: 14.95, y: 1.55 },
  { x: -22.95, z: 14, y: 1.6 },
  { x: -22, z: 17.95, y: 1.5 },
] as const;
export type DeliveryContext = { trailer: Point; loading: Point; speed: number };
export function pickedApples(progress: Progress): number[] {
  return progress.picked ?? (progress.completed.includes("orchard") ? [0, 1, 2] : []);
}
export function nearbyApple(progress: Progress, point: Point) {
  if (!progress.completed.includes("garden") || progress.completed.includes("orchard")) return -1;
  const picked = pickedApples(progress);
  return HARVEST_APPLES.findIndex(
    (apple, i) => !picked.includes(i) && distance(apple, point) <= 1.25,
  );
}
export function harvestApple(progress: Progress, point: Point, allowed: boolean) {
  const index = nearbyApple(progress, point);
  if (!allowed || index < 0)
    return {
      progress,
      changed: false,
      message: "Find a ripe apple on a low branch and walk within arm’s reach.",
    };
  const picked = [...pickedApples(progress), index];
  const updated: Progress = {
    ...progress,
    picked,
    apples: picked.length,
    basket: "carried",
    completed: picked.length === 3 ? [...progress.completed, "orchard"] : progress.completed,
  };
  return {
    progress: updated,
    changed: true,
    message:
      picked.length === 3
        ? "Basket full. Carry it to the table, or load it into the tractor trailer."
        : `Apple ${picked.length}/3 picked. Find another low branch nearby.`,
  };
}
export function canTransferBasket(progress: Progress, point: Point, context: DeliveryContext) {
  return (
    progress.apples === 3 &&
    distance(point, context.loading) <= 1.8 &&
    Math.abs(context.speed) < 0.15
  );
}
export function transferBasket(
  progress: Progress,
  point: Point,
  context: DeliveryContext,
  allowed: boolean,
) {
  if (!allowed || !canTransferBasket(progress, point, context))
    return {
      progress,
      changed: false,
      message: "Stop the tractor and walk to the back of the trailer with your basket.",
    };
  const loaded = progress.basket !== "trailer";
  const updated: Progress = { ...progress, basket: loaded ? "trailer" : "carried" };
  if (!loaded && distance(context.trailer, destination("table")!) <= 4.5)
    updated.usedTrailer = true;
  return {
    progress: updated,
    changed: true,
    message: loaded
      ? "Basket secured in the trailer. Drive to the shared table, then stop and unload."
      : "Basket in your hands. Bring it close to the shared table and press E.",
  };
}
export function trailerLoadingPoint(point: Point & { yaw: number }): Point {
  return { x: point.x - Math.sin(point.yaw) * 1.5, z: point.z - Math.cos(point.yaw) * 1.5 };
}
