import { destination, distance, type DestinationId, type Point } from "./world";

export const ACTIVITIES = [
  { id: "studio", title: "A maker’s hello", task: "Visit the maker’s studio", detail: "Walk to the studio and press E to meet the work." },
  { id: "well", title: "Water for the garden", task: "Fill the watering can", detail: "Take the path to the well, then fill your can." },
  { id: "garden", title: "A little care", task: "Water the kitchen garden", detail: "Bring your water to the kitchen garden." },
  { id: "orchard", title: "Something to share", task: "Pick three apples", detail: "Visit the orchard and collect apples for the table." },
  { id: "table", title: "Room for one more", task: "Bring apples to the shared table", detail: "Set the apples down at the future gathering courtyard." },
] as const;
export type ActivityId = typeof ACTIVITIES[number]["id"];
export type Progress = { completed: ActivityId[]; water: number; apples: number };
export const freshProgress = (): Progress => ({ completed: [], water: 0, apples: 0 });
export function nextActivity(progress: Progress) { return ACTIVITIES.find(activity => !progress.completed.includes(activity.id)) ?? null; }

/** Only a real, unpaused nearby visitor can change the digital farm inventory. */
export function interact(progress: Progress, id: DestinationId, point: Point, allowed: boolean) {
  const place = destination(id);
  if (!allowed || !place || distance(place, point) > 3.2) return { progress, message: "Walk closer to this place to interact.", changed: false };
  const activity = ACTIVITIES.find(entry => entry.id === id);
  if (!activity) return { progress, message: place.note, changed: false };
  if (progress.completed.includes(activity.id)) return { progress, message: `${activity.title} — already in your journal.`, changed: false };
  const next = nextActivity(progress);
  if (next?.id !== id) return { progress, message: `First: ${next?.task.toLowerCase() ?? "finish your visit"}.`, changed: false };
  if (id === "garden" && progress.water < 1) return { progress, message: "Your can needs water from the well.", changed: false };
  if (id === "table" && progress.apples < 3) return { progress, message: "Bring three apples from the orchard.", changed: false };
  const updated: Progress = {
    completed: [...progress.completed, activity.id],
    water: id === "well" ? 3 : id === "garden" ? progress.water - 1 : progress.water,
    apples: id === "orchard" ? 3 : id === "table" ? progress.apples - 3 : progress.apples,
  };
  const messages: Record<ActivityId, string> = {
    studio: "Welcome to the studio. Your farm journal has begun.",
    well: "Watering can filled. The garden is next.",
    garden: "The bed is watered. Now pick something to share.",
    orchard: "Three apples in your basket. Take them to the shared table.",
    table: "The table is set. Your first farm visit is complete — stay and explore.",
  };
  return { progress: updated, message: messages[activity.id], changed: true };
}
