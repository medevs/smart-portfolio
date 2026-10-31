"use client";
import { useEffect, useRef, useState } from "react";

/** Local synthesis only. A deliberate click creates the context; it never autoplays. */
export function useAmbience(paused: boolean, volume: number) {
  const state = useRef<{ context: AudioContext; gain: GainNode; source: AudioBufferSourceNode } | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const update = () => {
      const audio = state.current;
      if (audio) audio.gain.gain.setTargetAtTime(paused || document.hidden ? 0 : volume * .12, audio.context.currentTime, .2);
    };
    update(); document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [paused, volume, enabled]);
  useEffect(() => () => {
    const audio = state.current; state.current = null;
    if (audio) { audio.source.stop(); void audio.context.close(); }
  }, []);
  async function toggle() {
    if (state.current) {
      state.current.source.stop(); await state.current.context.close(); state.current = null; setEnabled(false); return;
    }
    let context: AudioContext | undefined;
    try {
      context = new AudioContext();
      await context.resume();
      if (context.state !== "running") throw new Error("Audio was blocked");
      const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * .5;
      const source = context.createBufferSource(); source.buffer = buffer; source.loop = true;
      const filter = context.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 650;
      const gain = context.createGain(); gain.gain.value = 0;
      source.connect(filter).connect(gain).connect(context.destination); source.start();
      state.current = { context, gain, source }; setEnabled(true); setError("");
    } catch { if (context) void context.close(); setError("Sound could not start on this device."); }
  }
  return { enabled, error, toggle };
}
