import { isWeather, type Weather } from "./weather";
import { FIELD_NOTES, type DiscoveryId } from "./discoveries";
import { safeSpawn } from "@/components/farm/scene/yard-boundaries";
import { ACTIVITIES, freshProgress, type ActivityId, type Progress } from "./progress";
import { SPAWN, type Point } from "./world";

export const SAVE_KEY = "medevsmaker.atlas-game.v1";
export type Preferences = { quality: "auto" | "low" | "high"; reducedMotion: boolean; daylight: boolean; volume: number; weather: Weather };
export type Profile = { version: 1; discoveries: DiscoveryId[]; progress: Progress; position: Point; preferences: Preferences; introduced: boolean };
export function freshProfile(): Profile {
  return { version: 1, discoveries: [], progress: freshProgress(), position: { ...SPAWN }, preferences: { quality: "auto", reducedMotion: false, daylight: false, volume: .35, weather: "clear" }, introduced: false };
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
    if (p.water !== (count < 2 ? 0 : count === 2 ? 3 : 2) || (count === 3 ? p.apples > 2 : p.apples !== (count === 4 ? 3 : 0))) return fresh;
    const picked = p.picked;
    if (picked !== undefined && (!Array.isArray(picked) || picked.some(id => !Number.isInteger(id) || id < 0 || id > 2) || new Set(picked).size !== picked.length || picked.length !== (count < 3 ? 0 : count === 3 ? p.apples : 3))) return fresh;
    if (count === 3 && p.apples > 0 && picked === undefined) return fresh;
    if (p.basket !== undefined && p.basket !== "carried" && p.basket !== "trailer") return fresh;
    if (p.basket === "trailer" && p.apples !== 3) return fresh;
    if (p.usedTrailer !== undefined && (typeof p.usedTrailer !== "boolean" || (p.usedTrailer && count < 4))) return fresh;
    if (p.delivery === "tractor" && p.usedTrailer !== true) return fresh;
    if (p.delivery !== undefined && (count !== 5 || (p.delivery !== "walk" && p.delivery !== "tractor"))) return fresh;
    fresh.progress = { completed, water: p.water, apples: p.apples };
    if (Array.isArray(picked)) fresh.progress.picked = [...picked];
    // Parking resets on reload; return cargo to the visitor, preserving every apple.
    if (p.basket !== undefined) fresh.progress.basket = "carried";
    if (p.usedTrailer === true) fresh.progress.usedTrailer = true;
    if (p.delivery === "walk" || p.delivery === "tractor") fresh.progress.delivery = p.delivery;
    if (Array.isArray(value.discoveries)) fresh.discoveries = FIELD_NOTES.filter(note => (value.discoveries as unknown[]).includes(note.id)).map(note => note.id);
    const prefs = value.preferences;
    if (isWeather(prefs.weather)) fresh.preferences.weather = prefs.weather;
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
