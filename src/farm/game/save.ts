import { FIELD_NOTES, type DiscoveryId } from "./discoveries";
import { safeSpawn } from "@/components/farm/scene/yard-boundaries";
import { ACTIVITIES, freshProgress, type ActivityId, type Progress } from "./progress";
import { SPAWN, type Point } from "./world";

export const SAVE_KEY = "medevsmaker.atlas-game.v1";
export type Preferences = { quality: "auto" | "low" | "high"; reducedMotion: boolean; daylight: boolean; volume: number };
export type Profile = { version: 1; discoveries: DiscoveryId[]; progress: Progress; position: Point; preferences: Preferences; introduced: boolean };
export function freshProfile(): Profile {
  return { version: 1, discoveries: [], progress: freshProgress(), position: { ...SPAWN }, preferences: { quality: "auto", reducedMotion: false, daylight: false, volume: .35 }, introduced: false };
}
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const bounded = (value: unknown, min: number, max: number): value is number => typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;

export function parseProfile(raw: string | null): Profile {
  const fresh = freshProfile();
  if (!raw) return fresh;
  try {
    const value: unknown = JSON.parse(raw);
    if (!record(value) || value.version !== 1 || !record(value.progress) || !record(value.preferences)) return fresh;
    const p = value.progress;
    if (!Array.isArray(p.completed) || !Number.isInteger(p.water) || !bounded(p.water, 0, 3) || !Number.isInteger(p.apples) || !bounded(p.apples, 0, 3)) return fresh;
    const completed: ActivityId[] = [];
    for (const activity of ACTIVITIES) {
      if (p.completed.includes(activity.id)) completed.push(activity.id);
      else break;
    }
    // Reject inconsistent saves rather than allowing impossible rewards.
    if (completed.length !== p.completed.length || new Set(p.completed).size !== p.completed.length || completed.some((id, index) => id !== (p.completed as unknown[])[index])) return fresh;
    const count = completed.length;
    if (p.water !== (count < 2 ? 0 : count === 2 ? 3 : 2) || p.apples !== (count === 4 ? 3 : 0)) return fresh;
    fresh.progress = { completed, water: p.water, apples: p.apples };
    if (Array.isArray(value.discoveries)) fresh.discoveries = FIELD_NOTES.filter(note => (value.discoveries as unknown[]).includes(note.id)).map(note => note.id);
    const prefs = value.preferences;
    if (prefs.quality === "auto" || prefs.quality === "low" || prefs.quality === "high") fresh.preferences.quality = prefs.quality;
    fresh.preferences.reducedMotion = prefs.reducedMotion === true;
    fresh.preferences.daylight = prefs.daylight === true;
    if (bounded(prefs.volume, 0, 1)) fresh.preferences.volume = prefs.volume;
    if (record(value.position) && bounded(value.position.x, -43, 43) && bounded(value.position.z, -43, 43) && safeSpawn({ x: value.position.x, z: value.position.z })) fresh.position = { x: value.position.x, z: value.position.z };
    fresh.introduced = value.introduced === true;
    return fresh;
  } catch { return fresh; }
}
export function readProfile(storage: Pick<Storage, "getItem">) {
  try { return { profile: parseProfile(storage.getItem(SAVE_KEY)), available: true }; }
  catch { return { profile: freshProfile(), available: false }; }
}
export function writeProfile(storage: Pick<Storage, "setItem">, profile: Profile) {
  try { storage.setItem(SAVE_KEY, JSON.stringify(profile)); return true; }
  catch { return false; }
}
