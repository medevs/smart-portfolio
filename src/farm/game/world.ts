export const DESTINATIONS = [
  { id: "studio", name: "Maker’s studio", x: -11, z: 1.4, note: "Meet the work behind medevsmaker.", product: "about" },
  { id: "well", name: "The well", x: -12.5, z: 5, note: "Fill your watering can for the garden." },
  { id: "garden", name: "Kitchen garden", x: 13, z: 22, note: "A few rows to care for, slowly." },
  { id: "orchard", name: "Apple orchard", x: -23, z: 15, note: "Rows of apple trees beside the seguia." },
  { id: "table", name: "Shared table", x: -3, z: 21.7, note: "An imagined future gathering courtyard." },
  { id: "workshop", name: "ReelStyles workshop", x: 1.1, z: 2, note: "Tools for making videos in code.", product: "reelstyles" },
  { id: "granary", name: "MentorClone granary", x: 8.8, z: -.3, note: "Knowledge to return to.", product: "mentorclone" },
  { id: "library", name: "TalkTheDoc library", x: 14.3, z: .5, note: "Conversations with your documents.", product: "talkthedoc" },
  { id: "home", name: "The homestead", x: 0, z: -12.8, note: "Stone, earth, shade and a solar roof." },
  { id: "guests", name: "Future guest spaces", x: 20, z: -12.4, note: "A future vision; visits are not bookable." },
  { id: "cedars", name: "Cedar edge", x: -20, z: -13, note: "The forest country that inspires this place." },
  { id: "gate", name: "Farm gate", x: 0, z: 8, note: "A familiar place to begin again." },
] as const;
export type DestinationId = typeof DESTINATIONS[number]["id"];
export type Point = { x: number; z: number };
export const SPAWN: Point = { x: 0, z: 8 };
export const ORCHARD_TREES = Array.from({ length: 48 }, (_, i) => ({ x: -31 + (i % 6) * 3, z: 8 + Math.floor(i / 6) * 3 }));
export function destination(id: string) { return DESTINATIONS.find(place => place.id === id) ?? null; }
export function distance(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.z - b.z); }
export function nearestPlace(point: Point) {
  return DESTINATIONS.reduce((nearest, place) => distance(point, place) < distance(point, nearest) ? place : nearest, DESTINATIONS[0] as typeof DESTINATIONS[number]);
}
