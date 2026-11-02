import { trailerLoadingPoint } from "@/farm/game/journey";
import { walk } from "./walk-state";

export function deliveryContext() {
  const trailer = {x:walk.trailerX,z:walk.trailerZ,yaw:walk.trailerYaw};
  return {trailer,loading:trailerLoadingPoint(trailer),speed:Math.max(walk.vehicleSpeed,walk.trailerSpeed)};
}
