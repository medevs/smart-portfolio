/** Artistic world settings, never a live forecast. */
export const WEATHER = {
  clear: { label: "Clear skies", overcast: 0, wind: .65 },
  breeze: { label: "Mountain breeze", overcast: .25, wind: 1.3 },
  rain: { label: "Gentle rain", overcast: .8, wind: .85 },
} as const;
export type Weather = keyof typeof WEATHER;
export function isWeather(value: unknown): value is Weather {
  return value === "clear" || value === "breeze" || value === "rain";
}

/** Fixed distribution: no random reallocations when weather or graphics change. */
export function rainSegment(index: number, seconds: number) {
  const x = ((index * 37.73) % 88) - 44;
  const z = ((index * 19.31) % 88) - 44;
  const y = 1 + ((index * 3.17 - seconds * 9) % 17 + 17) % 17;
  return [x, y, z, x + .08, y + .45, z] as const;
}
