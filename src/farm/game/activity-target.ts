import { destination, type DestinationId } from "./world";
import { HARVEST_APPLES, pickedApples, type DeliveryContext } from "./journey";
import { nextActivity, type Progress } from "./progress";

/** Navigation and the scene marker must point at the same usable interaction. */
export function activityTarget(progress: Progress, id: DestinationId, context: DeliveryContext) {
  const place = destination(id)!;
  const apple =
    id === "orchard" && nextActivity(progress)?.id === "orchard"
      ? HARVEST_APPLES.find((_, i) => !pickedApples(progress).includes(i))
      : null;
  const loading = id === "table" && progress.basket === "trailer" ? context.loading : null;
  const point = apple ?? loading ?? place;
  return {
    x: point.x,
    z: point.z,
    label: apple
      ? `Apple ${pickedApples(progress).length + 1} of 3`
      : loading
        ? "Your basket at the trailer"
        : place.name,
  };
}
