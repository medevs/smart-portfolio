"use client";
import {
  CAMERA_MIN,
  CAMERA_MAX,
  cameraView,
  setCameraDistance,
  resetCameraView,
} from "../scene/camera-view";
import { WEATHER } from "@/farm/game/weather";
import type { LightMode } from "../scene/scene-types";
import type { FarmGame } from "./useFarmGame";
import type { useAmbience } from "./useAmbience";

export function SettingsPanel({
  game,
  light,
  onLight,
  audio,
}: {
  game: FarmGame;
  light: LightMode;
  onLight: (mode: LightMode) => void;
  audio: ReturnType<typeof useAmbience>;
}) {
  const prefs = game.profile.preferences;
  return (
    <div className="game-settings">
      <label>
        Camera distance · close to wide
        <input
          type="range"
          min={CAMERA_MIN}
          max={CAMERA_MAX}
          step=".2"
          defaultValue={cameraView.distance}
          onChange={(e) => setCameraDistance(Number(e.target.value))}
        />
      </label>
      <button
        onClick={() => {
          resetCameraView();
          game.close();
        }}
      >
        Reset camera & resume
      </button>
      <p className="game-muted">
        Wheel or pinch to zoom. Drag the scene to look around your character. Keyboard: + closer, −
        wider. Camera controls apply when the world resumes.
      </p>
      <label>
        Weather
        <select
          value={prefs.weather}
          onChange={(e) => game.preferences({ weather: e.target.value as typeof prefs.weather })}
        >
          {Object.entries(WEATHER).map(([value, option]) => (
            <option key={value} value={value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <p className="game-muted">
        Choose the atmosphere of this digital visit. Rain softens the sky and shelters the bees;
        breeze stirs the grass. This is not a live forecast. Ambient motion stops with Reduce
        ambient motion.
      </p>
      <label>
        Graphics
        <select
          value={prefs.quality}
          onChange={(e) => game.preferences({ quality: e.target.value as typeof prefs.quality })}
        >
          <option value="auto">Automatic</option>
          <option value="low">Low · no postprocessing</option>
          <option value="high">High · more detail</option>
        </select>
      </label>
      <p className="game-muted">
        Automatic starts with lighter graphics and reduces resolution if rendering falls behind.
        Choose High for extra foliage and effects.
      </p>
      <label>
        <input
          type="checkbox"
          checked={prefs.reducedMotion}
          onChange={(e) => game.preferences({ reducedMotion: e.target.checked })}
        />{" "}
        Reduce ambient motion
      </label>
      <label>
        <input
          type="checkbox"
          checked={prefs.daylight}
          onChange={(e) => game.preferences({ daylight: e.target.checked })}
        />{" "}
        Automatic daylight cycle
      </label>
      <label>
        Time of day
        <select
          value={light}
          onChange={(e) => {
            game.preferences({ daylight: false });
            onLight(e.target.value as LightMode);
          }}
        >
          <option value="day">Day</option>
          <option value="sunset">Sunset</option>
          <option value="night">Night</option>
        </select>
      </label>
      <div>
        <button onClick={() => void audio.toggle()}>
          {audio.enabled ? "Mute ambience" : "Enable quiet wind ambience"}
        </button>
        <p className="game-muted">Synthesized wind, off at the start of every visit.</p>
        {audio.error && <p role="status">{audio.error}</p>}
      </div>
      <label>
        Sound volume
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={prefs.volume}
          onChange={(e) => game.preferences({ volume: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}
