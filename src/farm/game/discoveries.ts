import { destination, distance, type DestinationId, type Point } from "./world";

export const FIELD_NOTES = [
  { id: "cedars", title: "Under the cedars", hint: "Follow the northern edge to the cedar shade.", action: "Explore the cedar edge", text: "Layered cedar branches, pale stone and open sky: this corner draws on the forest country around Azrou and Ifrane. The bench is a place to stop and look back over the orchard." },
  { id: "home", title: "Earth, stone and sunlight", hint: "Look for the homestead’s solar roof.", action: "Look around the homestead", text: "Warm earth walls and stone meet a quieter modern addition: solar panels, shaded windows and a courtyard. This is an imagined home inspired by the Middle Atlas, rather than a reconstruction of an existing property." },
  { id: "guests", title: "Room for one more", hint: "Take the path toward the two guest houses.", action: "Discover the guest-space idea", text: "A future idea for sharing the farm with visitors and makers: a small room, a shared table and time to build something together. These spaces are a concept; stays and events are not bookable." },
  { id: "apiary", title: "Life beside the orchard", hint: "Find the wooden hives beside the growing beds.", action: "Watch the beehives", text: "Watch the small bees circle the wooden hives. The orchard, garden and water channel form the productive heart of this digital farm. Leave the bees their space and follow the seguia back toward the well." },
] as const;
export type DiscoveryId = typeof FIELD_NOTES[number]["id"];
export function fieldNote(id: string) { return FIELD_NOTES.find(note => note.id === id); }
export function discover(found: DiscoveryId[], id: DestinationId, point: Point, allowed: boolean) {
  const note = fieldNote(id), place = destination(id);
  if (!allowed || !note || !place || distance(point, place) > 3.2) return { found, changed: false, note: null };
  return { found: found.includes(note.id) ? found : [...found, note.id], changed: !found.includes(note.id), note };
}
