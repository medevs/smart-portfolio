/** Sprite keys the farm can draw. Adding a shape means adding it here and in the 3D registry. */
export const SPRITE_IDS = [
  "barn",
  "farmhouse",
  "silo",
  "shed",
  "windmill",
  "waterTower",
  "coop",
  "pond",
  "tree",
  "blossom",
  "wheat",
  "crops",
  "scarecrow",
  "chicken",
  "hen",
  "cow",
  "sheep",
  "donkey",
  "cat",
  "dog",
  "tractor",
  "mailbox",
  "stall",
  "sign",
  "fence",
  "hay",
  "greenhouse",
  "fencePeg",
  "flowerSign",
  "animalSign",
  "plotStake",
] as const;

export type SpriteId = (typeof SPRITE_IDS)[number];

const set = new Set<string>(SPRITE_IDS);

export function isSpriteId(value: string) {
  return set.has(value);
}
